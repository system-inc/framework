ExtractRarStream = Class.extend({

    rarAlgorithm: null,
    rarredFileSystemObject: null,

    // Temp
    buffer: null,

	construct: function(rarredFileSystemObject, buffer) {
        this.rarredFileSystemObject = rarredFileSystemObject;

        // Create a byte array to store all of the archived bytes
        var archivedByteBuffer = new bitjs.io.ByteBuffer(this.rarredFileSystemObject.archivedSizeInBytes);

        // Insert the archived bytes into the byte array
        archivedByteBuffer.insertBytes(buffer);

        // Create a bit stream from the archived byte buffer
        archivedBitStream = new bitjs.io.BitStream(archivedByteBuffer.data, true, 0, this.rarredFileSystemObject.archivedSizeInBytes);

        // Create a byte buffer to store the extracted bytes
        extractedByteBuffer = new bitjs.io.ByteBuffer(this.rarredFileSystemObject.extractedSizeInBytes);

        // Determine the archive method version
        var archiveMethodVersion = this.rarredFileSystemObject.header.version;
        if(archiveMethodVersion < 15) {
            archiveMethodVersion = 15;
        }

        // RAR 1.5
        if(archiveMethodVersion == 15) {
            this.rarAlgorithm = 'RAR 1.5';
            extractRarStream = this.extractRar1(archivedBitStream);
        }
        // RAR 2.x and files larger than 2 GB
        else if(archiveMethodVersion == 20 || archiveMethodVersion == 26) {
            this.rarAlgorithm = 'RAR 2.x';
            extractRarStream = this.extractRar2(archivedBitStream);
        }
        // RAR 3.x and alternative hash
        else if(archiveMethodVersion == 29 || archiveMethodVersion == 36) {
            this.rarAlgorithm = 'RAR 3.x';
            extractRarStream = this.extractRar3(archivedBitStream);
        }
        else {
            throw new Error('Unable to extract '+this.rarredFileSystemObject.path+' from RAR file '+this.rarredFileSystemObject.archiveFile.path+' which is archived with archive method '+archiveMethodVersion+'.');
        }

        // TODO: Supposed to return a transform stream
        //extractRarStream = new bitjs.io.ByteStream(extractedByteBuffer.data, true, 0, this.rarredFileSystemObject.extractedSizeInBytes);
        this.buffer = new Buffer(extractedByteBuffer.data);

        return extractRarStream;
	},

    extractRar3: function(archivedBitStream) {
        // lazy initialize rDDecode and rDBits
        var DDecode = new Array(rDC);
        var DBits = new Array(rDC);

        var Dist=0,BitLength=0,Slot=0;

        for (var I = 0; I < rDBitLengthCounts.length; I++,BitLength++) {
            for (var J = 0; J < rDBitLengthCounts[I]; J++,Slot++,Dist+=(1<<BitLength)) {
                DDecode[Slot]=Dist;
                DBits[Slot]=BitLength;
            }
        }

        var Bits;
        //tablesRead = false;

        rOldDist = [0,0,0,0]

        lastDist = 0;
        lastLength = 0;

        for (var i = UnpOldTable.length; i--;) UnpOldTable[i] = 0;

        // read in Huffman tables

        RarReadTables(archivedBitStream);

        while (true) {
            var num = RarDecodeNumber(archivedBitStream, LD);

            if (num < 256) {
                extractedByteBuffer.insertByte(num);
                continue;
            }
            if (num >= 271) {
                var Length = rLDecode[num -= 271] + 3;
                if ((Bits = rLBits[num]) > 0) {
                    Length += archivedBitStream.readBits(Bits);
                }
                var DistNumber = RarDecodeNumber(archivedBitStream, DD);
                var Distance = DDecode[DistNumber]+1;
                if ((Bits = DBits[DistNumber]) > 0) {
                    if (DistNumber > 9) {
                        if (Bits > 4) {
                            Distance += ((archivedBitStream.getBits() >>> (20 - Bits)) << 4);
                            archivedBitStream.readBits(Bits - 4);
                            //todo: check this
                        }
                        if (lowDistRepCount > 0) {
                            lowDistRepCount--;
                            Distance += prevLowDist;
                        } else {
                            var LowDist = RarDecodeNumber(archivedBitStream, LDD);
                            if (LowDist == 16) {
                                lowDistRepCount = rLOW_DIST_REP_COUNT - 1;
                                Distance += prevLowDist;
                            } else {
                                Distance += LowDist;
                                prevLowDist = LowDist;
                            }
                        }
                    } else {
                        Distance += archivedBitStream.readBits(Bits);
                    }
                }
                if (Distance >= 0x2000) {
                    Length++;
                    if (Distance >= 0x40000) {
                        Length++;
                    }
                }
                RarInsertOldDist(Distance);
                RarInsertLastMatch(Length, Distance);
                RarCopyString(Length, Distance);
                continue;
            }
            if (num == 256) {
                if (!RarReadEndOfBlock(archivedBitStream)) break;

                continue;
            }
            if (num == 257) {
                //console.log("READVMCODE");
                if (!RarReadVMCode(archivedBitStream)) break;
                continue;
            }
            if (num == 258) {
                if (lastLength != 0) {
                    RarCopyString(lastLength, lastDist);
                }
                continue;
            }
            if (num < 263) {
                var DistNum = num - 259;
                var Distance = rOldDist[DistNum];

                for (var I = DistNum; I > 0; I--) {
                    rOldDist[I] = rOldDist[I-1];
                }
                rOldDist[0] = Distance;

                var LengthNumber = RarDecodeNumber(archivedBitStream, RD);
                var Length = rLDecode[LengthNumber] + 2;
                if ((Bits = rLBits[LengthNumber]) > 0) {
                    Length += archivedBitStream.readBits(Bits);
                }
                RarInsertLastMatch(Length, Distance);
                RarCopyString(Length, Distance);
                continue;
            }
            if (num < 272) {
                var Distance = rSDDecode[num -= 263] + 1;
                if ((Bits = rSDBits[num]) > 0) {
                    Distance += archivedBitStream.readBits(Bits);
                }
                RarInsertOldDist(Distance);
                RarInsertLastMatch(2, Distance);
                RarCopyString(2, Distance);
                continue;
            }
        }
        //console.log("end unpack data block");
    },

    extractRar2: function(archivedBitStream) {
        var destUnpSize = extractedByteBuffer.data.length;
        var oldDistPtr = 0;

        RarReadTables20(archivedBitStream);
        while (destUnpSize > extractedByteBuffer.ptr) {
            var num = RarDecodeNumber(archivedBitStream, LD);
            if (num < 256) {
                extractedByteBuffer.insertByte(num);
                continue;
            }
            if (num > 269) {
                var Length = rLDecode[num -= 270] + 3;
                if ((Bits = rLBits[num]) > 0) {
                    Length += archivedBitStream.readBits(Bits);
                }
                var DistNumber = RarDecodeNumber(archivedBitStream, DD);
                var Distance = rDDecode[DistNumber] + 1;
                if ((Bits = rDBits[DistNumber]) > 0) {
                    Distance += archivedBitStream.readBits(Bits);
                }
                if (Distance >= 0x2000) {
                    Length++;
                    if(Distance >= 0x40000) Length++;
                }
                lastLength = Length;
                lastDist = rOldDist[oldDistPtr++ & 3] = Distance;
                RarCopyString(Length, Distance);
                continue;
            }
            if (num == 269) {
                RarReadTables20(archivedBitStream);

                continue;
            }
            if (num == 256) {
                lastDist = rOldDist[oldDistPtr++ & 3] = lastDist;
                RarCopyString(lastLength, lastDist);
                continue;
            }
            if (num < 261) {
                var Distance = rOldDist[(oldDistPtr - (num - 256)) & 3];
                var LengthNumber = RarDecodeNumber(archivedBitStream, RD);
                var Length = rLDecode[LengthNumber] +2;
                if ((Bits = rLBits[LengthNumber]) > 0) {
                    Length += archivedBitStream.readBits(Bits);
                }
                if (Distance >= 0x101) {
                    Length++;
                    if (Distance >= 0x2000) {
                        Length++
                        if (Distance >= 0x40000) Length++;
                    }
                }
                lastLength = Length;
                lastDist = rOldDist[oldDistPtr++ & 3] = Distance;
                RarCopyString(Length, Distance);
                continue;
            }
            if (num < 270) {
                var Distance = rSDDecode[num -= 261] + 1;
                if ((Bits = rSDBits[num]) > 0) {
                    Distance += archivedBitStream.readBits(Bits);
                }
                lastLength = 2;
                lastDist = rOldDist[oldDistPtr++ & 3] = Distance;
                RarCopyString(2, Distance);
                continue;
            }
        }
    },

    extractRar1: function(archivedBitStream) {
        throw new Error('Unable to extract '+this.rarredFileSystemObject.path+' from RAR file '+this.rarredFileSystemObject.archiveFile.path+' is archived with RAR version 1.5 which is not supported.');
    },

});

/////////////////////


// TODO:
// TURN ALL OF THESE INTO STATIC OR CLASS VARIABLES OF ExtractRarStream

var currentFilename = '';
var currentFileNumber = 0;
var currentBytesUnarchivedInFile = 0;
var currentBytesUnarchived = 0;
var totalUncompressedBytesInArchive = 0;
var totalFilesInArchive = 0;

var BLOCK_LZ = 0;
var BLOCK_PPM = 1;

var rLDecode = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224];
var rLBits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
var rDBitLengthCounts = [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 14, 0, 12];
var rSDDecode = [0, 4, 8, 16, 32, 64, 128, 192];
var rSDBits = [2, 2, 3, 4, 5, 6, 6, 6];
var rDDecode = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576, 32768, 49152, 65536, 98304, 131072, 196608, 262144, 327680, 393216, 458752, 524288, 589824, 655360, 720896, 786432, 851968, 917504, 983040];
var rDBits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];

var rLOW_DIST_REP_COUNT = 16;
var rNC = 299;
var rDC = 60;
var rLDC = 17;
var rRC = 28;
var rBC = 20;
var rHUFF_TABLE_SIZE = (rNC+rDC+rRC+rLDC);

var UnpBlockType = BLOCK_LZ;
var UnpOldTable = new Array(rHUFF_TABLE_SIZE);

//bitdecode
var BD = {
    DecodeLen: new Array(16),
    DecodePos: new Array(16),
    DecodeNum: new Array(rBC)
};
//litdecode
var LD = {
    DecodeLen: new Array(16),
    DecodePos: new Array(16),
    DecodeNum: new Array(rNC)
};
//distdecode
var DD = {
    DecodeLen: new Array(16),
    DecodePos: new Array(16),
    DecodeNum: new Array(rDC)
};
//low dist decode
var LDD = {
    DecodeLen: new Array(16),
    DecodePos: new Array(16),
    DecodeNum: new Array(rLDC)
};
//rep decode
var RD = {
    DecodeLen: new Array(16),
    DecodePos: new Array(16),
    DecodeNum: new Array(rRC)
};

var extractedByteBuffer;

var rNC20 = 298;
var rDC20 = 48;
var rRC20 = 28;
var rBC20 = 19;
var rMC20 = 257;

var UnpOldTable20 = new Array(rMC20 * 4);

var lowDistRepCount = 0, prevLowDist = 0;
var rOldDist = [0,0,0,0];
var lastDist;
var lastLength;
var archivedBitStream;
var rOldBuffers = [];


/////////////////////////////////////////////////  io.js ///////////////////////////////////////////////////////
/*
 * io.js
 *
 * Provides readers for bit/byte streams (reading) and a byte buffer (writing).
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2011 Google Inc.
 * Copyright(c) 2011 antimatter15
 */

var bitjs = bitjs || {};
bitjs.io = bitjs.io || {};

(function() {

// mask for getting the Nth bit (zero-based)
    bitjs.BIT = [	0x01, 0x02, 0x04, 0x08,
        0x10, 0x20, 0x40, 0x80,
        0x100, 0x200, 0x400, 0x800,
        0x1000, 0x2000, 0x4000, 0x8000];

// mask for getting N number of bits (0-8)
    var BITMASK = [0, 0x01, 0x03, 0x07, 0x0F, 0x1F, 0x3F, 0x7F, 0xFF ];


    /**
     * This bit stream peeks and consumes bits out of a binary stream.
     *
     * @param {ArrayBuffer} ab An ArrayBuffer object or a Uint8Array.
     * @param {boolean} rtl Whether the stream reads bits from the byte starting
     *     from bit 7 to 0 (true) or bit 0 to 7 (false).
     * @param {Number} opt_offset The offset into the ArrayBuffer
     * @param {Number} opt_length The length of this BitStream
     */
    bitjs.io.BitStream = function(ab, rtl, opt_offset, opt_length) {
        //console.log(ab.toString());
        if (!ab || !ab.toString) {
            throw "Error! BitArray constructed with an invalid ArrayBuffer object";
        }

        var offset = opt_offset || 0;
        var length = opt_length || ab.byteLength;
        this.bytes = new Uint8Array(ab, offset, length);
        this.bytePtr = 0; // tracks which byte we are on
        this.bitPtr = 0; // tracks which bit we are on (can have values 0 through 7)
        this.peekBits = rtl ? this.peekBits_rtl : this.peekBits_ltr;
    };


    /**
     *   byte0      byte1      byte2      byte3
     * 7......0 | 7......0 | 7......0 | 7......0
     *
     * The bit pointer starts at bit0 of byte0 and moves left until it reaches
     * bit7 of byte0, then jumps to bit0 of byte1, etc.
     * @param {number} n The number of bits to peek.
     * @param {boolean=} movePointers Whether to move the pointer, defaults false.
     * @return {number} The peeked bits, as an unsigned number.
     */
    bitjs.io.BitStream.prototype.peekBits_ltr = function(n, movePointers) {
        if (n <= 0 || typeof n != typeof 1) {
            return 0;
        }

        var movePointers = movePointers || false,
            bytePtr = this.bytePtr,
            bitPtr = this.bitPtr,
            result = 0,
            bitsIn = 0,
            bytes = this.bytes;

        // keep going until we have no more bits left to peek at
        // TODO: Consider putting all bits from bytes we will need into a variable and then
        //       shifting/masking it to just extract the bits we want.
        //       This could be considerably faster when reading more than 3 or 4 bits at a time.
        while (n > 0) {
            if (bytePtr >= bytes.length) {
                throw "Error!  Overflowed the bit stream! n=" + n + ", bytePtr=" + bytePtr + ", bytes.length=" +
                bytes.length + ", bitPtr=" + bitPtr;
                return -1;
            }

            var numBitsLeftInThisByte = (8 - bitPtr);
            if (n >= numBitsLeftInThisByte) {
                var mask = (BITMASK[numBitsLeftInThisByte] << bitPtr);
                result |= (((bytes[bytePtr] & mask) >> bitPtr) << bitsIn);

                bytePtr++;
                bitPtr = 0;
                bitsIn += numBitsLeftInThisByte;
                n -= numBitsLeftInThisByte;
            }
            else {
                var mask = (BITMASK[n] << bitPtr);
                result |= (((bytes[bytePtr] & mask) >> bitPtr) << bitsIn);

                bitPtr += n;
                bitsIn += n;
                n = 0;
            }
        }

        if (movePointers) {
            this.bitPtr = bitPtr;
            this.bytePtr = bytePtr;
        }

        return result;
    };


    /**
     *   byte0      byte1      byte2      byte3
     * 7......0 | 7......0 | 7......0 | 7......0
     *
     * The bit pointer starts at bit7 of byte0 and moves right until it reaches
     * bit0 of byte0, then goes to bit7 of byte1, etc.
     * @param {number} n The number of bits to peek.
     * @param {boolean=} movePointers Whether to move the pointer, defaults false.
     * @return {number} The peeked bits, as an unsigned number.
     */
    bitjs.io.BitStream.prototype.peekBits_rtl = function(n, movePointers) {
        if (n <= 0 || typeof n != typeof 1) {
            return 0;
        }

        var movePointers = movePointers || false,
            bytePtr = this.bytePtr,
            bitPtr = this.bitPtr,
            result = 0,
            bytes = this.bytes;

        // keep going until we have no more bits left to peek at
        // TODO: Consider putting all bits from bytes we will need into a variable and then
        //       shifting/masking it to just extract the bits we want.
        //       This could be considerably faster when reading more than 3 or 4 bits at a time.
        while (n > 0) {

            if (bytePtr >= bytes.length) {
                throw "Error!  Overflowed the bit stream! n=" + n + ", bytePtr=" + bytePtr + ", bytes.length=" +
                bytes.length + ", bitPtr=" + bitPtr;
                return -1;
            }

            var numBitsLeftInThisByte = (8 - bitPtr);
            if (n >= numBitsLeftInThisByte) {
                result <<= numBitsLeftInThisByte;
                result |= (BITMASK[numBitsLeftInThisByte] & bytes[bytePtr]);
                bytePtr++;
                bitPtr = 0;
                n -= numBitsLeftInThisByte;
            }
            else {
                result <<= n;
                result |= ((bytes[bytePtr] & (BITMASK[n] << (8 - n - bitPtr))) >> (8 - n - bitPtr));

                bitPtr += n;
                n = 0;
            }
        }

        if (movePointers) {
            this.bitPtr = bitPtr;
            this.bytePtr = bytePtr;
        }

        return result;
    };


    /**
     * Some voodoo magic.
     */
    bitjs.io.BitStream.prototype.getBits = function() {
        return (((((this.bytes[this.bytePtr] & 0xff) << 16) +
        ((this.bytes[this.bytePtr+1] & 0xff) << 8) +
        ((this.bytes[this.bytePtr+2] & 0xff))) >>> (8-this.bitPtr)) & 0xffff);
    };


    /**
     * Reads n bits out of the stream, consuming them (moving the bit pointer).
     * @param {number} n The number of bits to read.
     * @return {number} The read bits, as an unsigned number.
     */
    bitjs.io.BitStream.prototype.readBits = function(n) {
        return this.peekBits(n, true);
    };


    /**
     * This returns n bytes as a sub-array, advancing the pointer if movePointers
     * is true.  Only use this for uncompressed blocks as this throws away remaining
     * bits in the current byte.
     * @param {number} n The number of bytes to peek.
     * @param {boolean=} movePointers Whether to move the pointer, defaults false.
     * @return {Uint8Array} The subarray.
     */
    bitjs.io.BitStream.prototype.peekBytes = function(n, movePointers) {
        if (n <= 0 || typeof n != typeof 1) {
            return 0;
        }

        // from http://tools.ietf.org/html/rfc1951#page-11
        // "Any bits of input up to the next byte boundary are ignored."
        while (this.bitPtr != 0) {
            this.readBits(1);
        }

        var movePointers = movePointers || false;
        var bytePtr = this.bytePtr,
            bitPtr = this.bitPtr;

        var result = this.bytes.subarray(bytePtr, bytePtr + n);

        if (movePointers) {
            this.bytePtr += n;
        }

        return result;
    };


    /**
     * @param {number} n The number of bytes to read.
     * @return {Uint8Array} The subarray.
     */
    bitjs.io.BitStream.prototype.readBytes = function(n) {
        return this.peekBytes(n, true);
    };


    /**
     * This object allows you to peek and consume bytes as numbers and strings
     * out of an ArrayBuffer.  In this buffer, everything must be byte-aligned.
     *
     * @param {ArrayBuffer} ab The ArrayBuffer object.
     * @param {number=} opt_offset The offset into the ArrayBuffer
     * @param {number=} opt_length The length of this BitStream
     * @constructor
     */
    bitjs.io.ByteStream = function(ab, opt_offset, opt_length) {
        var offset = opt_offset || 0;
        var length = opt_length || ab.byteLength;
        this.bytes = new Uint8Array(ab, offset, length);
        this.ptr = 0;
    };


    /**
     * Peeks at the next n bytes as an unsigned number but does not advance the
     * pointer
     * TODO: This apparently cannot read more than 4 bytes as a number?
     * @param {number} n The number of bytes to peek at.
     * @return {number} The n bytes interpreted as an unsigned number.
     */

    bitjs.io.ByteStream.prototype.toString = function(){
        return this.readString(this.bytes.length);
    }


    bitjs.io.ByteStream.prototype.peekNumber = function(n) {
        // TODO: return error if n would go past the end of the stream?
        if (n <= 0 || typeof n != typeof 1)
            return -1;

        var result = 0;
        // read from last byte to first byte and roll them in
        var curByte = this.ptr + n - 1;
        while (curByte >= this.ptr) {
            result <<= 8;
            result |= this.bytes[curByte];
            --curByte;
        }
        return result;
    };


    /**
     * Returns the next n bytes as an unsigned number (or -1 on error)
     * and advances the stream pointer n bytes.
     * @param {number} n The number of bytes to read.
     * @return {number} The n bytes interpreted as an unsigned number.
     */
    bitjs.io.ByteStream.prototype.readNumber = function(n) {
        var num = this.peekNumber( n );
        this.ptr += n;
        return num;
    };


    /**
     * Returns the next n bytes as a signed number but does not advance the
     * pointer.
     * @param {number} n The number of bytes to read.
     * @return {number} The bytes interpreted as a signed number.
     */
    bitjs.io.ByteStream.prototype.peekSignedNumber = function(n) {
        var num = this.peekNumber(n);
        var HALF = Math.pow(2, (n * 8) - 1);
        var FULL = HALF * 2;

        if (num >= HALF) num -= FULL;

        return num;
    };


    /**
     * Returns the next n bytes as a signed number and advances the stream pointer.
     * @param {number} n The number of bytes to read.
     * @return {number} The bytes interpreted as a signed number.
     */
    bitjs.io.ByteStream.prototype.readSignedNumber = function(n) {
        var num = this.peekSignedNumber(n);
        this.ptr += n;
        return num;
    };


    /**
     * This returns n bytes as a sub-array, advancing the pointer if movePointers
     * is true.
     * @param {number} n The number of bytes to read.
     * @param {boolean} movePointers Whether to move the pointers.
     * @return {Uint8Array} The subarray.
     */
    bitjs.io.ByteStream.prototype.peekBytes = function(n, movePointers) {
        if (n <= 0 || typeof n != typeof 1) {
            return null;
        }

        var result = this.bytes.subarray(this.ptr, this.ptr + n);

        if (movePointers) {
            this.ptr += n;
        }

        return result;
    };


    /**
     * Reads the next n bytes as a sub-array.
     * @param {number} n The number of bytes to read.
     * @return {Uint8Array} The subarray.
     */
    bitjs.io.ByteStream.prototype.readBytes = function(n) {
        return this.peekBytes(n, true);
    };


    /**
     * Peeks at the next n bytes as a string but does not advance the pointer.
     * @param {number} n The number of bytes to peek at.
     * @return {string} The next n bytes as a string.
     */
    bitjs.io.ByteStream.prototype.peekString = function(n) {
        if (n <= 0 || typeof n != typeof 1) {
            return "";
        }

        var result = "";
        for (var p = this.ptr, end = this.ptr + n; p < end; ++p) {
            result += String.fromCharCode(this.bytes[p]);
        }
        return result;
    };


    /**
     * Returns the next n bytes as an ASCII string and advances the stream pointer
     * n bytes.
     * @param {number} n The number of bytes to read.
     * @return {string} The next n bytes as a string.
     */
    bitjs.io.ByteStream.prototype.readString = function(n) {
        var strToReturn = this.peekString(n);
        this.ptr += n;
        return strToReturn;
    };


    /**
     * A write-only Byte buffer which uses a Uint8 Typed Array as a backing store.
     * @param {number} numBytes The number of bytes to allocate.
     * @constructor
     */
    bitjs.io.ByteBuffer = function(numBytes) {
        if (typeof numBytes != typeof 1 || numBytes <= 0) {
            throw "Error! ByteBuffer initialized with '" + numBytes + "'";
        }
        this.data = new Uint8Array(numBytes);
        this.ptr = 0;
    };


    /**
     * @param {number} b The byte to insert.
     */
    bitjs.io.ByteBuffer.prototype.insertByte = function(b) {
        // TODO: throw if byte is invalid?
        this.data[this.ptr++] = b;
    };


    /**
     * @param {Array.<number>|Uint8Array|Int8Array} bytes The bytes to insert.
     */
    bitjs.io.ByteBuffer.prototype.insertBytes = function(bytes) {
        // TODO: throw if bytes is invalid?
        this.data.set(bytes, this.ptr);
        this.ptr += bytes.length;
    };


    /**
     * Writes an unsigned number into the next n bytes.  If the number is too large
     * to fit into n bytes or is negative, an error is thrown.
     * @param {number} num The unsigned number to write.
     * @param {number} numBytes The number of bytes to write the number into.
     */
    bitjs.io.ByteBuffer.prototype.writeNumber = function(num, numBytes) {
        if (numBytes < 1) {
            throw 'Trying to write into too few bytes: ' + numBytes;
        }
        if (num < 0) {
            throw 'Trying to write a negative number (' + num +
            ') as an unsigned number to an ArrayBuffer';
        }
        if (num > (Math.pow(2, numBytes * 8) - 1)) {
            throw 'Trying to write ' + num + ' into only ' + numBytes + ' bytes';
        }

        // Roll 8-bits at a time into an array of bytes.
        var bytes = [];
        while (numBytes-- > 0) {
            var eightBits = num & 255;
            bytes.push(eightBits);
            num >>= 8;
        }

        this.insertBytes(bytes);
    };


    /**
     * Writes a signed number into the next n bytes.  If the number is too large
     * to fit into n bytes, an error is thrown.
     * @param {number} num The signed number to write.
     * @param {number} numBytes The number of bytes to write the number into.
     */
    bitjs.io.ByteBuffer.prototype.writeSignedNumber = function(num, numBytes) {
        if (numBytes < 1) {
            throw 'Trying to write into too few bytes: ' + numBytes;
        }

        var HALF = Math.pow(2, (numBytes * 8) - 1);
        if (num >= HALF || num < -HALF) {
            throw 'Trying to write ' + num + ' into only ' + numBytes + ' bytes';
        }

        // Roll 8-bits at a time into an array of bytes.
        var bytes = [];
        while (numBytes-- > 0) {
            var eightBits = num & 255;
            bytes.push(eightBits);
            num >>= 8;
        }

        this.insertBytes(bytes);
    };


    /**
     * @param {string} str The ASCII string to write.
     */
    bitjs.io.ByteBuffer.prototype.writeASCIIString = function(str) {
        for (var i = 0; i < str.length; ++i) {
            var curByte = str.charCodeAt(i);
            if (curByte < 0 || curByte > 255) {
                throw 'Trying to write a non-ASCII string!';
            }
            this.insertByte(curByte);
        }
    };

})();

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// archive.js
/**
 * archive.js
 *
 * Provides base functionality for unarchiving.
 *
 * Licensed under the MIT License
 *
 * Copyright(c) 2011 Google Inc.
 */

var bitjs = bitjs || {};
bitjs.archive = bitjs.archive || {};

(function() {

// ===========================================================================
// Stolen from Closure because it's the best way to do Java-like inheritance.
    bitjs.base = function(me, opt_methodName, var_args) {
        var caller = arguments.callee.caller;
        if (caller.superClass_) {
            // This is a constructor. Call the superclass constructor.
            return caller.superClass_.constructor.apply(
                me, Array.prototype.slice.call(arguments, 1));
        }

        var args = Array.prototype.slice.call(arguments, 2);
        var foundCaller = false;
        for (var ctor = me.constructor;
             ctor; ctor = ctor.superClass_ && ctor.superClass_.constructor) {
            if (ctor.prototype[opt_methodName] === caller) {
                foundCaller = true;
            } else if (foundCaller) {
                return ctor.prototype[opt_methodName].apply(me, args);
            }
        }

        // If we did not find the caller in the prototype chain,
        // then one of two things happened:
        // 1) The caller is an instance method.
        // 2) This method was not called by the right caller.
        if (me[opt_methodName] === caller) {
            return me.constructor.prototype[opt_methodName].apply(me, args);
        } else {
            throw Error(
                'goog.base called from a method of one name ' +
                'to a method of a different name');
        }
    };
    bitjs.inherits = function(childCtor, parentCtor) {
        /** @constructor */
        function tempCtor() {};
        tempCtor.prototype = parentCtor.prototype;
        childCtor.superClass_ = parentCtor.prototype;
        childCtor.prototype = new tempCtor();
        childCtor.prototype.constructor = childCtor;
    };
// ===========================================================================

    /**
     * An unarchive event.
     *
     * @param {string} type The event type.
     * @constructor
     */
    bitjs.archive.UnarchiveEvent = function(type) {
        /**
         * The event type.
         *
         * @type {string}
         */
        this.type = type;
    };

    /**
     * The UnarchiveEvent types.
     */
    bitjs.archive.UnarchiveEvent.Type = {
        START: 'start',
        PROGRESS: 'progress',
        EXTRACT: 'extract',
        FINISH: 'finish',
        INFO: 'info',
        ERROR: 'error'
    };

    /**
     * Useful for passing info up to the client (for debugging).
     *
     * @param {string} msg The info message.
     */
    bitjs.archive.UnarchiveInfoEvent = function(msg) {
        bitjs.base(this, bitjs.archive.UnarchiveEvent.Type.INFO);

        /**
         * The information message.
         *
         * @type {string}
         */
        this.msg = msg;
    };
    bitjs.inherits(bitjs.archive.UnarchiveInfoEvent, bitjs.archive.UnarchiveEvent);

    /**
     * An unrecoverable error has occured.
     *
     * @param {string} msg The error message.
     */
    bitjs.archive.UnarchiveErrorEvent = function(msg) {
        bitjs.base(this, bitjs.archive.UnarchiveEvent.Type.ERROR);

        /**
         * The information message.
         *
         * @type {string}
         */
        this.msg = msg;
    };
    bitjs.inherits(bitjs.archive.UnarchiveErrorEvent, bitjs.archive.UnarchiveEvent);

    /**
     * Start event.
     *
     * @param {string} msg The info message.
     */
    bitjs.archive.UnarchiveStartEvent = function() {
        bitjs.base(this, bitjs.archive.UnarchiveEvent.Type.START);
    };
    bitjs.inherits(bitjs.archive.UnarchiveStartEvent, bitjs.archive.UnarchiveEvent);

    /**
     * Finish event.
     *
     * @param {string} msg The info message.
     */
    bitjs.archive.UnarchiveFinishEvent = function() {
        bitjs.base(this, bitjs.archive.UnarchiveEvent.Type.FINISH);
    };
    bitjs.inherits(bitjs.archive.UnarchiveFinishEvent, bitjs.archive.UnarchiveEvent);

    /**
     * Progress event.
     */
    bitjs.archive.UnarchiveProgressEvent = function(
        currentFilename,
        currentFileNumber,
        currentBytesUnarchivedInFile,
        currentBytesUnarchived,
        totalUncompressedBytesInArchive,
        totalFilesInArchive) {
        bitjs.base(this, bitjs.archive.UnarchiveEvent.Type.PROGRESS);

        this.currentFilename = currentFilename;
        this.currentFileNumber = currentFileNumber;
        this.currentBytesUnarchivedInFile = currentBytesUnarchivedInFile;
        this.totalFilesInArchive = totalFilesInArchive;
        this.currentBytesUnarchived = currentBytesUnarchived;
        this.totalUncompressedBytesInArchive = totalUncompressedBytesInArchive;
    };
    bitjs.inherits(bitjs.archive.UnarchiveProgressEvent, bitjs.archive.UnarchiveEvent);

    /**
     * All extracted files returned by an Unarchiver will implement
     * the following interface:
     *
     * interface UnarchivedFile {
 *   string filename
 *   TypedArray fileData
 * }
     *
     */

    /**
     * Extract event.
     */
    bitjs.archive.UnarchiveExtractEvent = function(unarchivedFile) {
        bitjs.base(this, bitjs.archive.UnarchiveEvent.Type.EXTRACT);

        /**
         * @type {UnarchivedFile}
         */
        this.unarchivedFile = unarchivedFile;
    };
    bitjs.inherits(bitjs.archive.UnarchiveExtractEvent, bitjs.archive.UnarchiveEvent);


    /**
     * Base class for all Unarchivers.
     *
     * @param {ArrayBuffer} arrayBuffer The Array Buffer.
     * @param {string} opt_pathToBitJS Optional string for where the BitJS files are located.
     * @constructor
     */
    bitjs.archive.Unarchiver = function(arrayBuffer, opt_pathToBitJS) {
        /**
         * The ArrayBuffer object.
         * @type {ArrayBuffer}
         * @protected
         */
        this.ab = arrayBuffer;

        /**
         * The path to the BitJS files.
         * @type {string}
         * @private
         */
        this.pathToBitJS_ = opt_pathToBitJS || '';

        /**
         * A map from event type to an array of listeners.
         * @type {Map.<string, Array>}
         */
        this.listeners_ = {};
        for (var type in bitjs.archive.UnarchiveEvent.Type) {
            this.listeners_[bitjs.archive.UnarchiveEvent.Type[type]] = [];
        }
    };

    /**
     * Private web worker initialized during start().
     * @type {Worker}
     * @private
     */
    bitjs.archive.Unarchiver.prototype.worker_ = null;

    /**
     * This method must be overridden by the subclass to return the script filename.
     * @return {string} The script filename.
     * @protected.
     */
    bitjs.archive.Unarchiver.prototype.getScriptFileName = function() {
        throw 'Subclasses of AbstractUnarchiver must overload getScriptFileName()';
    };

    /**
     * Adds an event listener for UnarchiveEvents.
     *
     * @param {string} Event type.
     * @param {function} An event handler function.
     */
    bitjs.archive.Unarchiver.prototype.addEventListener = function(type, listener) {
        if (type in this.listeners_) {
            if (this.listeners_[type].indexOf(listener) == -1) {
                this.listeners_[type].push(listener);
            }
        }
    };

    /**
     * Removes an event listener.
     *
     * @param {string} Event type.
     * @param {EventListener|function} An event listener or handler function.
     */
    bitjs.archive.Unarchiver.prototype.removeEventListener = function(type, listener) {
        if (type in this.listeners_) {
            var index = this.listeners_[type].indexOf(listener);
            if (index != -1) {
                this.listeners_[type].splice(index, 1);
            }
        }
    };

    /**
     * Receive an event and pass it to the listener functions.
     *
     * @param {bitjs.archive.UnarchiveEvent} e
     * @private
     */
    bitjs.archive.Unarchiver.prototype.handleWorkerEvent_ = function(e) {
        if ((e instanceof bitjs.archive.UnarchiveEvent || e.type) &&
            this.listeners_[e.type] instanceof Array) {
            this.listeners_[e.type].forEach(function (listener) { listener(e) });
            if (e.type == bitjs.archive.UnarchiveEvent.Type.FINISH) {
                this.worker_.terminate();
            }
        } else {
            console.log(e);
        }
    };

    /**
     * Starts the unarchive in a separate Web Worker thread and returns immediately.
     */
    bitjs.archive.Unarchiver.prototype.start = function() {
        var me = this;
        var scriptFileName = this.pathToBitJS_ + this.getScriptFileName();
        if (scriptFileName) {
            this.worker_ = new Worker(scriptFileName);

            this.worker_.onerror = function(e) {
                console.log('Worker error: message = ' + e.message);
                throw e;
            };

            this.worker_.onmessage = function(e) {
                if (typeof e.data == 'string') {
                    // Just log any strings the workers pump our way.
                    console.log(e.data);
                } else {
                    // Assume that it is an UnarchiveEvent.  Some browsers preserve the 'type'
                    // so that instanceof UnarchiveEvent returns true, but others do not.
                    me.handleWorkerEvent_(e.data);
                }
            };

            this.worker_.postMessage({file: this.ab});
        }
    };

    /**
     * Terminates the Web Worker for this Unarchiver and returns immediately.
     */
    bitjs.archive.Unarchiver.prototype.stop = function() {
        if (this.worker_) {
            this.worker_.terminate();
        }
    };


    /**
     * Unzipper
     * @extends {bitjs.archive.Unarchiver}
     * @constructor
     */
    bitjs.archive.Unzipper = function(arrayBuffer, opt_pathToBitJS) {
        bitjs.base(this, arrayBuffer, opt_pathToBitJS);
    };
    bitjs.inherits(bitjs.archive.Unzipper, bitjs.archive.Unarchiver);
    bitjs.archive.Unzipper.prototype.getScriptFileName = function() { return 'unzip.js' };

    /**
     * Unrarrer
     * @extends {bitjs.archive.Unarchiver}
     * @constructor
     */
    bitjs.archive.Unrarrer = function(arrayBuffer, opt_pathToBitJS) {
        bitjs.base(this, arrayBuffer, opt_pathToBitJS);
    };
    bitjs.inherits(bitjs.archive.Unrarrer, bitjs.archive.Unarchiver);
    bitjs.archive.Unrarrer.prototype.getScriptFileName = function() { return 'unrar.js' };

    /**
     * Untarrer
     * @extends {bitjs.archive.Unarchiver}
     * @constructor
     */
    bitjs.archive.Untarrer = function(arrayBuffer, opt_pathToBitJS) {
        bitjs.base(this, arrayBuffer, opt_pathToBitJS);
    };
    bitjs.inherits(bitjs.archive.Untarrer, bitjs.archive.Unarchiver);
    bitjs.archive.Untarrer.prototype.getScriptFileName = function() { return 'untar.js' };

})();
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///// unrar.js
// Progress variables.

// Helper functions.
var info = function(str) {
    postMessage(new bitjs.archive.UnarchiveInfoEvent(str));
};
var err = function(str) {
    postMessage(new bitjs.archive.UnarchiveErrorEvent(str));
};
var postProgress = function() {
    postMessage(new bitjs.archive.UnarchiveProgressEvent(
        currentFilename,
        currentFileNumber,
        currentBytesUnarchivedInFile,
        currentBytesUnarchived,
        totalUncompressedBytesInArchive,
        totalFilesInArchive));
};

// shows a byte value as its hex representation
var nibble = "0123456789ABCDEF";
var byteValueToHexString = function(num) {
    return nibble[num>>4] + nibble[num&0xF];
};
var twoByteValueToHexString = function(num) {
    return nibble[(num>>12)&0xF] + nibble[(num>>8)&0xF] + nibble[(num>>4)&0xF] + nibble[num&0xF];
};


// read in Huffman tables for RAR
function RarReadTables(bstream) {
    var BitLength = new Array(rBC),
        Table = new Array(rHUFF_TABLE_SIZE);

    // before we start anything we need to get byte-aligned
    bstream.readBits( (8 - bstream.bitPtr) & 0x7 );

    if (bstream.readBits(1)) {
        info("Error!  PPM not implemented yet");
        return;
    }

    if (!bstream.readBits(1)) { //discard old table
        for (var i = UnpOldTable.length; i--;) UnpOldTable[i] = 0;
    }

    // read in bit lengths
    for (var I = 0; I < rBC; ++I) {

        var Length = bstream.readBits(4);
        if (Length == 15) {
            var ZeroCount = bstream.readBits(4);
            if (ZeroCount == 0) {
                BitLength[I] = 15;
            }
            else {
                ZeroCount += 2;
                while (ZeroCount-- > 0 && I < rBC)
                    BitLength[I++] = 0;
                --I;
            }
        }
        else {
            BitLength[I] = Length;
        }
    }

    // now all 20 bit lengths are obtained, we construct the Huffman Table:

    RarMakeDecodeTables(BitLength, 0, BD, rBC);

    var TableSize = rHUFF_TABLE_SIZE;
    //console.log(DecodeLen, DecodePos, DecodeNum);
    for (var i = 0; i < TableSize;) {
        var num = RarDecodeNumber(bstream, BD);
        if (num < 16) {
            Table[i] = (num + UnpOldTable[i]) & 0xf;
            i++;
        } else if(num < 18) {
            var N = (num == 16) ? (bstream.readBits(3) + 3) : (bstream.readBits(7) + 11);

            while (N-- > 0 && i < TableSize) {
                Table[i] = Table[i - 1];
                i++;
            }
        } else {
            var N = (num == 18) ? (bstream.readBits(3) + 3) : (bstream.readBits(7) + 11);

            while (N-- > 0 && i < TableSize) {
                Table[i++] = 0;
            }
        }
    }

    RarMakeDecodeTables(Table, 0, LD, rNC);
    RarMakeDecodeTables(Table, rNC, DD, rDC);
    RarMakeDecodeTables(Table, rNC + rDC, LDD, rLDC);
    RarMakeDecodeTables(Table, rNC + rDC + rLDC, RD, rRC);

    for (var i = UnpOldTable.length; i--;) {
        UnpOldTable[i] = Table[i];
    }
    return true;
}


function RarDecodeNumber(bstream, dec) {
    var DecodeLen = dec.DecodeLen, DecodePos = dec.DecodePos, DecodeNum = dec.DecodeNum;
    var bitField = bstream.getBits() & 0xfffe;
    //some sort of rolled out binary search
    var bits = ((bitField < DecodeLen[8])?
        ((bitField < DecodeLen[4])?
            ((bitField < DecodeLen[2])?
                ((bitField < DecodeLen[1])?1:2)
                :((bitField < DecodeLen[3])?3:4))
            :(bitField < DecodeLen[6])?
            ((bitField < DecodeLen[5])?5:6)
            :((bitField < DecodeLen[7])?7:8))
        :((bitField < DecodeLen[12])?
        ((bitField < DecodeLen[10])?
            ((bitField < DecodeLen[9])?9:10)
            :((bitField < DecodeLen[11])?11:12))
        :(bitField < DecodeLen[14])?
        ((bitField < DecodeLen[13])?13:14)
        :15));
    bstream.readBits(bits);
    var N = DecodePos[bits] + ((bitField - DecodeLen[bits -1]) >>> (16 - bits));

    return DecodeNum[N];
}



function RarMakeDecodeTables(BitLength, offset, dec, size) {
    var DecodeLen = dec.DecodeLen, DecodePos = dec.DecodePos, DecodeNum = dec.DecodeNum;
    var LenCount = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        TmpPos = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        N = 0, M = 0;
    for (var i = DecodeNum.length; i--;) DecodeNum[i] = 0;
    for (var i = 0; i < size; i++) {
        LenCount[BitLength[i + offset] & 0xF]++;
    }
    LenCount[0] = 0;
    TmpPos[0] = 0;
    DecodePos[0] = 0;
    DecodeLen[0] = 0;

    for (var I = 1; I < 16; ++I) {
        N = 2 * (N+LenCount[I]);
        M = (N << (15-I));
        if (M > 0xFFFF)
            M = 0xFFFF;
        DecodeLen[I] = M;
        DecodePos[I] = DecodePos[I-1] + LenCount[I-1];
        TmpPos[I] = DecodePos[I];
    }
    for (I = 0; I < size; ++I)
        if (BitLength[I + offset] != 0)
            DecodeNum[ TmpPos[ BitLength[offset + I] & 0xF ]++] = I;

}





function RarReadTables20(bstream) {
    var BitLength = new Array(rBC20);
    var Table = new Array(rMC20 * 4);
    var TableSize, N, I;
    var AudioBlock = bstream.readBits(1);
    if (!bstream.readBits(1))
        for (var i = UnpOldTable20.length; i--;) UnpOldTable20[i] = 0;
    TableSize = rNC20 + rDC20 + rRC20;
    for (var I = 0; I < rBC20; I++)
        BitLength[I] = bstream.readBits(4);
    RarMakeDecodeTables(BitLength, 0, BD, rBC20);
    I = 0;
    while (I < TableSize) {
        var num = RarDecodeNumber(bstream, BD);
        if (num < 16) {
            Table[I] = num + UnpOldTable20[I] & 0xf;
            I++;
        } else if(num == 16) {
            N = bstream.readBits(2) + 3;
            while (N-- > 0 && I < TableSize) {
                Table[I] = Table[I - 1];
                I++;
            }
        } else {
            if (num == 17) {
                N = bstream.readBits(3) + 3;
            } else {
                N = bstream.readBits(7) + 11;
            }
            while (N-- > 0 && I < TableSize) {
                Table[I++] = 0;
            }
        }
    }
    RarMakeDecodeTables(Table, 0, LD, rNC20);
    RarMakeDecodeTables(Table, rNC20, DD, rDC20);
    RarMakeDecodeTables(Table, rNC20 + rDC20, RD, rRC20);
    for (var i = UnpOldTable20.length; i--;) UnpOldTable20[i] = Table[i];
}



function RarReadEndOfBlock(bstream) {

    var NewTable = false, NewFile = false;
    if (bstream.readBits(1)) {
        NewTable = true;
    } else {
        NewFile = true;
        NewTable = !!bstream.readBits(1);
    }
    //tablesRead = !NewTable;
    return !(NewFile || NewTable && !RarReadTables(bstream));
}


function RarReadVMCode(bstream) {
    var FirstByte = bstream.readBits(8);
    var Length = (FirstByte & 7) + 1;
    if (Length == 7) {
        Length = bstream.readBits(8) + 7;
    } else if(Length == 8) {
        Length = bstream.readBits(16);
    }
    var vmCode = [];
    for(var I = 0; I < Length; I++) {
        //do something here with cheking readbuf
        vmCode.push(bstream.readBits(8));
    }
    return RarAddVMCode(FirstByte, vmCode, Length);
}

function RarAddVMCode(firstByte, vmCode, length) {
    //console.log(vmCode);
    if (vmCode.length > 0) {
        info("Error! RarVM not supported yet!");
    }
    return true;
}

function RarInsertLastMatch(length, distance) {
    lastDist = distance;
    lastLength = length;
}

function RarInsertOldDist(distance) {
    rOldDist.splice(3,1);
    rOldDist.splice(0,0,distance);
}

//this is the real function, the other one is for debugging
function RarCopyString(length, distance) {
    var destPtr = extractedByteBuffer.ptr - distance;
    if(destPtr < 0){
        var l = rOldBuffers.length;
        while(destPtr < 0){
            destPtr = rOldBuffers[--l].data.length + destPtr;
        }
        //TODO: lets hope that it never needs to read beyond file boundaries
        while(length--) extractedByteBuffer.insertByte(rOldBuffers[l].data[destPtr++]);

    }
    if (length > distance) {
        while(length--) extractedByteBuffer.insertByte(extractedByteBuffer.data[destPtr++]);
    } else {
        extractedByteBuffer.insertBytes(extractedByteBuffer.data.subarray(destPtr, destPtr + length));
    }

}


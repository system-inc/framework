RarredFileSystemObject = ArchivedFileSystemObject.extend({

	header: null,

	construct: function(archiveFile, header) {
		this.super.call(this, archiveFile);

		this.header = header;

		// Initialize class variables from central directory header
		this.path = this.header.path;
		this.archiveMethod = this.header.archiveMethod;
		this.archiveMethodOptions = this.header.archiveMethodOptions;
		this.archivedSizeInBytes = this.header.archivedSizeInBytes;
		this.extractedSizeInBytes = this.header.extractedSizeInBytes;
		this.comment = this.header.comment;

		// Just use time modified for all of these
		this.timeAccessed = this.header.timeModified;
		this.timeModified = this.header.timeModified;
		this.timeStatusChanged = this.header.timeModified;
		this.timeCreated = this.header.timeModified;

		// Use FileSystemObject's constructor to setup class variables based on path
		FileSystemObject.prototype.construct.call(this, this.path);
	},

	toReadStream: function*(decompress) {
		decompress = decompress === undefined ? true : false; // decompress by default

		// The archived data begins at the end of the block header
		var start = this.header.offset + this.header.sizeInBytes;
		// TODO: Why do I have to -1 here and not in the block header?
		var end = start + this.header.archivedSizeInBytes - 1;

		// If the rarred file system object has no bytes
		if(end <= start) {
			return false;
		}
		else {
			// Create the read stream
			var readStream = yield this.archiveFile.toReadStream({
				start: start,
				end: end,
			});

			// If they want the file decompressed
			if(decompress) {
				// Need to extraction stream to pipe the read stream into

				this.extract(readStream);

				//var deflate = Node.Zlib.createDeflate();
				//readStream = readStream.pipe(deflate);
			}

			return readStream;
		}
    },

    extract: function*(readStream) {
    	console.log('Extracting', this.path, 'compressed with', this.header.archiveMethod);

		var archiveMethodVersion = this.header.version;
		if(archiveMethodVersion < 15) {
			archiveMethodVersion = 15;
		}

		var extracted = null;

		// RAR 1.5
		if(archiveMethodVersion == 15) {

		}
		// RAR 2.x and files larger than 2 GB
		else if(archiveMethodVersion == 20 || archiveMethodVersion == 26) {

		}
		// RAR 3.x and alternative hash
		else if(archiveMethodVersion == 29 || archiveMethodVersion == 36) {
			extracted = yield this.extractRar3(readStream);
		}
    },

	// Read Huffman tables for RAR
	readHuffmanTables: function(readStream) {
		var bitLength = new Array(Rar.rBC);
		var table = new Array(Rar.rHUFF_TABLE_SIZE);

		// Before we start anything we need to get byte-aligned
		//bstream.readBits( (8 - bstream.bitPtr) & 0x7 );

		//if (bstream.readBits(1)) {
		//info("Error!  PPM not implemented yet");
		//return;
		//}

		//if (!bstream.readBits(1)) { //discard old table
		//for (var i = UnpOldTable.length; i--;) UnpOldTable[i] = 0;
		//}

		//// read in bit lengths
		//for (var I = 0; I < Rar.rBC; ++I) {

		//var Length = bstream.readBits(4);
		//if (Length == 15) {
		//var ZeroCount = bstream.readBits(4);
		//if (ZeroCount == 0) {
		//bitLength[I] = 15;
		//}
		//else {
		//ZeroCount += 2;
		//while (ZeroCount-- > 0 && I < Rar.rBC)
		//bitLength[I++] = 0;
		//--I;
		//}
		//}
		//else {
		//bitLength[I] = Length;
		//}
		//}

		//// now all 20 bit lengths are obtained, we construct the Huffman Table:

		//RarMakeDecodeTables(bitLength, 0, BD, Rar.rBC);

		//var TableSize = rHUFF_TABLE_SIZE;
		////console.log(DecodeLen, DecodePos, DecodeNum);
		//for (var i = 0; i < TableSize;) {
		//var num = RarDecodeNumber(bstream, BD);
		//if (num < 16) {
		//Table[i] = (num + UnpOldTable[i]) & 0xf;
		//i++;
		//} else if(num < 18) {
		//var N = (num == 16) ? (bstream.readBits(3) + 3) : (bstream.readBits(7) + 11);

		//while (N-- > 0 && i < TableSize) {
		//Table[i] = Table[i - 1];
		//i++;
		//}
		//} else {
		//var N = (num == 18) ? (bstream.readBits(3) + 3) : (bstream.readBits(7) + 11);

		//while (N-- > 0 && i < TableSize) {
		//Table[i++] = 0;
		//}
		//}
		//}

		//RarMakeDecodeTables(Table, 0, LD, rNC);
		//RarMakeDecodeTables(Table, rNC, DD, rDC);
		//RarMakeDecodeTables(Table, rNC + rDC, LDD, rLDC);
		//RarMakeDecodeTables(Table, rNC + rDC + rLDC, RD, rRC);  

		//for (var i = UnpOldTable.length; i--;) {
		//UnpOldTable[i] = Table[i];
		//}

		//return true;
	},

    extractRar3: function*(readStream) {
		var dDecode = new Array(Rar.rDC);
		var dBits = new Array(Rar.rDC);
		  
		var dist = 0;
		var bitLength = 0;
		var slot = 0;
		  
		for(var i = 0; i < Rar.rdBitLengthCounts.length; i++, bitLength++) {
			for(var k = 0; k < Rar.rdBitLengthCounts[i]; k++, slot++, dist += (1 << bitLength)) {
				dDecode[slot] = dist;
				dBits[slot] = bitLength;
			}
		}

	  	var bits;

	  	var rOldDist = [0, 0, 0, 0];
		var lastDist = 0;
		var lastLength = 0;

		//for(var i = Rar.unpackOldTable.length; i--;) {
		//	Rar.unpackOldTable[i] = 0;
		//}

		// Read Huffman tables
		//this.readHuffmanTables(readStream);

		//while (true) {
		//var num = RarDecodeNumber(bstream, LD);

		//if (num < 256) {
		//rBuffer.insertByte(num);
		//continue;
		//}
		//if (num >= 271) {
		//var Length = rLDecode[num -= 271] + 3;
		//if ((bits = rLbits[num]) > 0) {
		//Length += bstream.readBits(bits);
		//}
		//var distNumber = RarDecodeNumber(bstream, DD);
		//var distance = dDecode[distNumber]+1;
		//if ((bits = dBits[distNumber]) > 0) {
		//if (distNumber > 9) {
		//if (bits > 4) {
		//distance += ((bstream.getbits() >>> (20 - bits)) << 4);
		//bstream.readBits(bits - 4);
		////todo: check this
		//}
		//if (lowdistRepCount > 0) {
		//lowdistRepCount--;
		//distance += prevLowdist;
		//} else {
		//var Lowdist = RarDecodeNumber(bstream, LDD);
		//if (Lowdist == 16) {
		//lowdistRepCount = rLOW_DIST_REP_COUNT - 1;
		//distance += prevLowdist;
		//} else {
		//distance += Lowdist;
		//prevLowdist = Lowdist;
		//}
		//}
		//} else {
		//distance += bstream.readBits(bits);
		//}
		//}
		//if (distance >= 0x2000) {
		//Length++;
		//if (distance >= 0x40000) {
		//Length++;
		//}
		//}
		//RarInsertOlddist(distance);
		//RarInsertLastMatch(Length, distance);
		//RarCopyString(Length, distance);
		//continue;
		//}
	//if (num == 256) {
	//	if (!RarReadEndOfBlock(bstream)) break;

	//	continue;
	//}
	//if (num == 257) {
	//	      //console.log("READVMCODE");
	//	      if (!RarReadVMCode(bstream)) break;
	//	      continue;
	//	  }
	//	  if (num == 258) {
	//	  	if (lastLength != 0) {
	//	  		RarCopyString(lastLength, lastDist);
	//	  	}
	//	  	continue;
	//	  }
	//	  if (num < 263) {
	//	  	var distNum = num - 259;
	//	  	var distance = rOldDist[distNum];

	//	  	for (var I = distNum; I > 0; I--) {
	//	  		rOldDist[I] = rOldDist[I-1];
	//	  	}
	//	  	rOldDist[0] = distance;

	//	  	var LengthNumber = RarDecodeNumber(bstream, RD);
	//	  	var Length = rLDecode[LengthNumber] + 2;
	//	  	if ((bits = rLbits[LengthNumber]) > 0) {
	//	  		Length += bstream.readBits(bits);
	//	  	}
	//	  	RarInsertLastMatch(Length, distance);
	//	  	RarCopyString(Length, distance);
	//	  	continue;
	//	  }
	//	  if (num < 272) {
	//	  	var distance = rSdDecode[num -= 263] + 1;
	//	  	if ((bits = rSdBits[num]) > 0) {
	//	  		distance += bstream.readBits(bits);
	//	  	}
	//	  	RarInsertOlddist(distance);
	//	  	RarInsertLastMatch(2, distance);
	//	  	RarCopyString(2, distance);
	//	  	continue;
	//	  }

	//	}
	//	RarUpdateProgress()
	//}


    },

});

Rar = {};
Rar.BLOCK_LZ = 0;
Rar.BLOCK_PPM = 1;
Rar.rLDecode = [0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24, 28, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224];
Rar.rLbits = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5];
Rar.rdBitLengthCounts = [4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 14, 0, 12];
Rar.rSdDecode = [0, 4, 8, 16, 32, 64, 128, 192];
Rar.rSdBits = [2, 2, 3, 4, 5, 6, 6, 6];
Rar.rdDecode = [0, 1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512, 768, 1024, 1536, 2048, 3072, 4096, 6144, 8192, 12288, 16384, 24576, 32768, 49152, 65536, 98304, 131072, 196608, 262144, 327680, 393216, 458752, 524288, 589824, 655360, 720896, 786432, 851968, 917504, 983040];
Rar.rdBits = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16];
Rar.rLOW_DIST_REP_COUNT = 16;
Rar.rNC = 299;
Rar.rDC = 60;
Rar.rLDC = 17;
Rar.rRC = 28;
Rar.rBC = 20;
Rar.rHUFF_TABLE_SIZE = (Rar.rNC + Rar.rDC + Rar.rRC + Rar.rLDC);
Rar.UnpBlockType = BLOCK_LZ;
Rar.unpackOldTable = new Array(Rar.rHUFF_TABLE_SIZE);
// Bit decode
Rar.BD = { 
	DecodeLen: new Array(16),
	DecodePos: new Array(16),
	DecodeNum: new Array(rBC),
};
// Lit decode
Rar.LD = { 
	DecodeLen: new Array(16),
	DecodePos: new Array(16),
	DecodeNum: new Array(rNC),
};
// dist decode
Rar.DD = { 
	DecodeLen: new Array(16),
	DecodePos: new Array(16),
	DecodeNum: new Array(rDC),
};
// Low dist decode
Rar.LDD = { 
	DecodeLen: new Array(16),
	DecodePos: new Array(16),
	DecodeNum: new Array(rLDC),
};
// Rep decode
Rar.RD = { 
	DecodeLen: new Array(16),
	DecodePos: new Array(16),
	DecodeNum: new Array(rRC),
};
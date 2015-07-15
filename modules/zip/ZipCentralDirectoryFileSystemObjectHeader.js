ZipCentralDirectoryFileSystemObjectHeader = Class.extend({

	//upper byte: 
	//0 - MS-DOS and OS/2 (FAT / VFAT / FAT32 file systems)
	//1 - Amiga 
	//2 - OpenVMS
	//3 - UNIX 
	//4 - VM/CMS
	//5 - Atari ST
	//6 - OS/2 H.P.F.S.
	//7 - Macintosh 
	//8 - Z-System
	//9 - CP/M 
	//10 - Windows NTFS
	//11 - MVS (OS/390 - Z/OS) 
	//12 - VSE
	//13 - Acorn Risc 
	//14 - VFAT
	//15 - alternate MVS 
	//16 - BeOS
	//17 - Tandem 
	//18 - OS/400
	//19 - OS/X (Darwin) 
	//20 - 255: unused
	//lower byte:
	//zip specification version
	versionMadeBy: null,

	versionNeededToExtract: null, // PKZip version needed to extract

	//General purpose bit flag:
	//Bit 00: encrypted file
	//Bit 01: compression option 
	//Bit 02: compression option 
	//Bit 03: data descriptor
	//Bit 04: enhanced deflation
	//Bit 05: compressed patched data
	//Bit 06: strong encryption
	//Bit 07-10: unused
	//Bit 11: language encoding
	//Bit 12: reserved
	//Bit 13: mask header values
	//Bit 14-15: reserved
	generalPurposeBitFlag: null,

	//Compression method
	//00: no compression
	//01: shrunk
	//02: reduced with compression factor 1
	//03: reduced with compression factor 2 
	//04: reduced with compression factor 3 
	//05: reduced with compression factor 4 
	//06: imploded
	//07: reserved
	//08: deflated
	//09: enhanced deflated
	//10: PKWare DCL imploded
	//11: reserved
	//12: compressed using BZIP2
	//13: reserved
	//14: LZMA
	//15-17: reserved
	//18: compressed using IBM TERSE
	//19: IBM LZ77 z
	//98: PPMd version I, Rev 1 
	compressionMethod: null,

	timeModified: null,

	//File modification time	stored in standard MS-DOS format:
	//Bits 00-04: seconds divided by 2 
	//Bits 05-10: minute
	//Bits 11-15: hour
	timeModifiedTime: null,

	//File modification date	stored in standard MS-DOS format:
	//Bits 00-04: day
	//Bits 05-08: month
	//Bits 09-15: years from 1980
	timeModifiedDate: null,

	crc32Checksum: null, // CRC-32 checksum	value computed over file data by CRC-32 algorithm with magic number 0xdebb20e3 (little endian)
	compressedSizeInBytes: null, // If archive is in ZIP64 format, this field is 0xffffffff and the length is stored in the extra field
	uncompressedSizeInBytes: null, // If archive is in ZIP64 format, this field is 0xffffffff and the length is stored in the extra field
	pathSizeInBytes: null, // The length of the path field below
	extraFieldSizeInBytes: null, // The length of the extra field below
	commentSizeInBytes: null, // The length of the comment
	volumeNumberWhereFileSystemObjectStarts: null, // The number of the volume on which this file system object exists

	//Internal file attributes:
	//Bit 0: apparent ASCII/text file
	//Bit 1: reserved
	//Bit 2: control field records precede logical records
	//Bits 3-16: unused
	internalAttributes: null,

	externalAttributes: null, // External file attributes (host-system dependent)
	offsetToLocalFileSystemObjectHeader: null, // This is the offset to the corresponding local file header from the start of the first volume
	
	path: null, // The path of the file system object including an optional relative path, all slashes in the path should be forward slashes '/'
	extraFields: [], // Used to store additional information, the field consistes of a sequence of header and data pairs, where the header has a 2 byte identifier and a 2 byte data size field
	comment: null, // An optional comment for the file system object

	sizeInBytes: null,

	construct: function() {
	},

	initializeFromBuffer: function(buffer, startOffset) {
		var actualSignature = buffer.readUInt32LE(startOffset);

		// Make sure the actual signature is valid
		if(actualSignature !== ZipCentralDirectoryFileSystemObjectHeader.signature) {
			throw new Error('Invalid central directory file system object header, expected 0x'+ZipCentralDirectoryFileSystemObjectHeader.signature.toString()+' but contained 0x'+actualSignature.toString()+'.');
		}

		this.versionMadeBy = buffer.readUInt16LE(startOffset + 4);
		this.versionNeededToExtract =  buffer.readUInt16LE(startOffset + 6);
		this.generalPurposeBitFlag = buffer.readUInt16LE(startOffset + 8);
		this.compressionMethod = buffer.readUInt16LE(startOffset + 10);
		this.timeModified = null;
		this.timeModifiedTime = buffer.readUInt16LE(startOffset + 12);
		this.timeModifiedDate = buffer.readUInt16LE(startOffset + 14);
		this.crc32Checksum = buffer.readUInt32LE(startOffset + 16);
		this.compressedSizeInBytes = buffer.readUInt32LE(startOffset + 20);
		this.uncompressedSizeInBytes = buffer.readUInt32LE(startOffset + 24);
		this.pathSizeInBytes = buffer.readUInt16LE(startOffset + 28);
		this.extraFieldSizeInBytes = buffer.readUInt16LE(startOffset + 30);
		this.commentSizeInBytes = buffer.readUInt16LE(startOffset + 32);
		this.volumeNumberWhereFileSystemObjectStarts = buffer.readUInt16LE(startOffset + 34);
		this.internalAttributes = buffer.readUInt16LE(startOffset + 36);
		this.externalAttributes = buffer.readUInt32LE(startOffset + 38);
		this.offsetToLocalFileSystemObjectHeader = buffer.readUInt32LE(startOffset + 42);

		// Get the path
		var pathIsUtf8 = (this.generalPurposeBitFlag & 0x800);
		// TODO: Use utf8 if path is utf8
		this.path = buffer.toString('utf8', startOffset + 46, startOffset + 46 + this.pathSizeInBytes);

		// Validate the path
		if(this.path.indexOf('\\') !== -1) {
			throw new Error('Zip file contains a path with a backslash which is disallowed, "'+this.path+'".');
		}
		if(/^[a-zA-Z]:/.test(this.path) || /^\//.test(this.path)) {
			throw new Error('Zip file contains a disallowed absolute path, "'+this.path+'".');
		}
		if(this.path.split('/').indexOf('..') !== -1) {
			throw new Error('Zip file contains an invalid relative path, "'+this.path+'".');
		}

		// Validate size
		if(this.compressionMethod === 0) { // Stored with no compression
			if(this.compressedSizeInBytes !== this.uncompressedSizeInBytes) {
				throw new Error('Compressed size ('+this.compressedSizeInBytes+') does not match uncompressed size ('+this.uncompressedSizeInBytes+') for '+this.path+'.');
			}
		}

		// Get the extra field data
		var extraFieldBuffer = buffer.slice(startOffset + 46 + this.pathSizeInBytes, startOffset + 46 + this.pathSizeInBytes + this.extraFieldSizeInBytes);
		var i = 0;
		while(i < extraFieldBuffer.length) {
			var headerIdentifier = extraFieldBuffer.readUInt16LE(i + 0);
			var dataSize = extraFieldBuffer.readUInt16LE(i + 2);
			var dataStart = i + 4;
			var dataEnd = dataStart + dataSize;
			var dataBuffer = new Buffer(dataSize);
			extraFieldBuffer.copy(dataBuffer, 0, dataStart, dataEnd);
			this.extraFields.push({
				identifier: headerIdentifier,
				data: dataBuffer,
			});
			i = dataEnd;
		}

		// Get the comment
		this.comment = buffer.toString('utf8', startOffset + 46 + this.pathSizeInBytes + this.extraFieldSizeInBytes, startOffset + 46 + this.pathSizeInBytes + this.extraFieldSizeInBytes + this.commentSizeInBytes);

		// Save the size of the entire header in bytes
		this.sizeInBytes = 46 + this.pathSizeInBytes + this.extraFieldSizeInBytes + this.commentSizeInBytes;
	},

});

ZipCentralDirectoryFileSystemObjectHeader.signature = 0x02014b50;
ZipCentralDirectoryFileSystemObjectHeader.sizeInBytes = 46;
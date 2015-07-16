ZipZippedFileSystemObjectHeader = Class.extend({

	minimumZipVersionNeededToExtractInteger: null,
	minimumZipVersionNeededToExtract: null,

	generalPurposeBitFlag: null,
	encrypted: null, // bit 0
	localFileSystemObjectHeaderHasSomePropertiesSetToZero: null, // bit 3
	compressedPatchedData: null, // bit 5
	usesStrongEncryption: null, // bit 6
	usesUtf8: null, // bit 11
	localFileSystemObjectHeaderMasksSomeProperties: null, // bit 13

	compressionMethodInteger: null,
	compressionMethod: null,
	compressionMethodOptions: {},

	timeModifiedTimeInteger: null,
	timeModifiedDateInteger: null,
	timeModified: null,

	crc32Checksum: null, // CRC-32 checksum	value computed over file data by CRC-32 algorithm with magic number 0xdebb20e3 (little endian)
	
	compressedSizeInBytes: null, // If archive is in ZIP64 format, this field is 0xffffffff and the length is stored in the extra field
	uncompressedSizeInBytes: null, // If archive is in ZIP64 format, this field is 0xffffffff and the length is stored in the extra field
	pathSizeInBytes: null, // The length of the path field below
	extraFieldSizeInBytes: null, // The length of the extra field below

	path: null, // The path of the file system object including an optional relative path, all slashes in the path should be forward slashes '/'
	extraFields: [], // Used to store additional information, the field consistes of a sequence of header and data pairs, where the header has a 2 byte identifier and a 2 byte data size field

	sizeInBytes: null,

	initializeFromBuffer: function(buffer, startOffset, bufferOffsets, headerSizeInBytes) {
		// Minimum version needed to extract
		this.minimumZipVersionNeededToExtractInteger =  buffer.readUInt16LE(startOffset + bufferOffsets.minimumZipVersionNeededToExtractInteger);
		this.minimumZipVersionNeededToExtract = new Version({
			major: Number.round(this.minimumZipVersionNeededToExtractInteger / 10),
			minor: this.minimumZipVersionNeededToExtractInteger % 10,
		});

		// Set the compression method
		this.compressionMethodInteger = buffer.readUInt16LE(startOffset + bufferOffsets.compressionMethodInteger);
		if(ZipZippedFileSystemObjectHeader.compressionMethodMap[this.compressionMethodInteger]) {
			this.compressionMethod = ZipZippedFileSystemObjectHeader.compressionMethodMap[this.compressionMethodInteger]
		}
		if(!ZipZippedFileSystemObjectHeader.supportedCompressionMethodsMap.contains(this.compressionMethod)) {
			throw new Error('Zip file contains a file system object compressed with an unsupported compression method, "'+this.compressionMethod+'".')
		}

		// Stores various information about the file system object
		this.generalPurposeBitFlag = buffer.readUInt16LE(startOffset + bufferOffsets.generalPurposeBitFlag);
		var generalPurposeBitFlagBit0 = this.generalPurposeBitFlag >> 0 & 1;
		var generalPurposeBitFlagBit1 = this.generalPurposeBitFlag >> 1 & 1;
		var generalPurposeBitFlagBit2 = this.generalPurposeBitFlag >> 2 & 1;
		var generalPurposeBitFlagBit3 = this.generalPurposeBitFlag >> 3 & 1;
		var generalPurposeBitFlagBit4 = this.generalPurposeBitFlag >> 4 & 1;
		var generalPurposeBitFlagBit5 = this.generalPurposeBitFlag >> 5 & 1;
		var generalPurposeBitFlagBit6 = this.generalPurposeBitFlag >> 6 & 1;
		//var generalPurposeBitFlagBit7 = this.generalPurposeBitFlag >> 7 & 1;
		//var generalPurposeBitFlagBit8 = this.generalPurposeBitFlag >> 8 & 1;
		//var generalPurposeBitFlagBit9 = this.generalPurposeBitFlag >> 9 & 1;
		//var generalPurposeBitFlagBit10 = this.generalPurposeBitFlag >> 10 & 1;
		var generalPurposeBitFlagBit11 = this.generalPurposeBitFlag >> 11 & 1;
		var generalPurposeBitFlagBit12 = this.generalPurposeBitFlag >> 12 & 1;
		var generalPurposeBitFlagBit13 = this.generalPurposeBitFlag >> 13 & 1;
		//var generalPurposeBitFlagBit14 = this.generalPurposeBitFlag >> 14 & 1;
		//var generalPurposeBitFlagBit15 = this.generalPurposeBitFlag >> 15 & 1;

		// Encryption
		this.encrypted = generalPurposeBitFlagBit0 ? true : false;

		// Imploding compression method
		if(this.compressionMethodInteger == 6) {
			// Sliding dictionary size
			if(generalPurposeBitFlagBit1) {
				this.compressionMethodOptions.slidingDictionarySize = '8K';
			}
			else {
				this.compressionMethodOptions.slidingDictionarySize = '4K';
			}

			// Shannon-Fano trees
			if(generalPurposeBitFlagBit2) { // bit 2
				this.compressionMethodOptions.shannonFanoTrees = 3;
			}
			else {
				this.compressionMethodOptions.shannonFanoTrees = 2;
			}
		}
		// Deflate and enhanced deflate
		else if(this.compressionMethodInteger == 8 || this.compressionMethodInteger == 9) {
			if(!generalPurposeBitFlagBit1 && !generalPurposeBitFlagBit2) {
				this.compressionMethodOptions.compressionType = 'normal';
			}
			else if(!generalPurposeBitFlagBit1 && generalPurposeBitFlagBit2) {
				this.compressionMethodOptions.compressionType = 'maximum';
			}
			else if(generalPurposeBitFlagBit1 && !generalPurposeBitFlagBit2) {
				this.compressionMethodOptions.compressionType = 'fast';
			}
			else if(generalPurposeBitFlagBit1 && generalPurposeBitFlagBit2) {
				this.compressionMethodOptions.compressionType = 'superFast';
			}
		}
		// LZMA
		else if(this.compressionMethodInteger == 14) {
			if(generalPurposeBitFlagBit1) {
				this.compressionMethodOptions.endOfStreamMarker = true;
			}
			else {
				this.compressionMethodOptions.endOfStreamMarker = false;
			}
		}

		// crc-32, compressed size, and uncompressed size properties in local header are set to 0 and the correct values are in the data descriptor immediately following the compressed data
		this.localFileSystemObjectHeaderHasSomePropertiesSetToZero = generalPurposeBitFlagBit3 ? true : false;

		// File is compressed patched data, requires PKZIP version 2.70 or greater
		this.compressedPatchedData = generalPurposeBitFlagBit5 ? true : false;

		// Uses strong encryption
		this.usesStrongEncryption = generalPurposeBitFlagBit6 ? true : false;

		// Uses UTF-8
		this.usesUtf8 = generalPurposeBitFlagBit11 ? true : false;

		// Set when encrypting the Central Directory to indicate selected data values in the Local Header are masked to hide their actual values
		this.localFileSystemObjectHeaderMasksSomeProperties = generalPurposeBitFlagBit11 ? true : false;

		// Time
		this.timeModifiedTimeInteger = buffer.readUInt16LE(startOffset + bufferOffsets.timeModifiedTimeInteger);
		this.timeModifiedDateInteger = buffer.readUInt16LE(startOffset + bufferOffsets.timeModifiedDateInteger);
		this.timeModified = Time.constructFromDosDateTime(this.timeModifiedDateInteger, this.timeModifiedTimeInteger);

		this.crc32Checksum = buffer.readUInt32LE(startOffset + bufferOffsets.crc32Checksum);

		this.compressedSizeInBytes = buffer.readUInt32LE(startOffset + bufferOffsets.compressedSizeInBytes);

		this.uncompressedSizeInBytes = buffer.readUInt32LE(startOffset + bufferOffsets.uncompressedSizeInBytes);

		this.pathSizeInBytes = buffer.readUInt16LE(startOffset + bufferOffsets.pathSizeInBytes);

		this.extraFieldSizeInBytes = buffer.readUInt16LE(startOffset + bufferOffsets.extraFieldSizeInBytes);

		// Get the path
		// TODO: Use utf8 if path is utf8
		this.path = buffer.toString('utf8', startOffset + headerSizeInBytes, startOffset + headerSizeInBytes + this.pathSizeInBytes);

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
		var extraFieldBuffer = buffer.slice(startOffset + headerSizeInBytes + this.pathSizeInBytes, startOffset + headerSizeInBytes + this.pathSizeInBytes + this.extraFieldSizeInBytes);
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
	},

});

// Static properties
ZipZippedFileSystemObjectHeader.signature = null;
ZipZippedFileSystemObjectHeader.sizeInBytes = null;
ZipZippedFileSystemObjectHeader.madeByOperatingSystemMap = {
	0: 'MS-DOS and OS/2 (FAT / VFAT / FAT32 file systems)',
	1: 'Amiga',
	2: 'OpenVMS',
	3: 'UNIX',
	4: 'VM/CMS',
	5: 'Atari ST',
	6: 'OS/2 H.P.F.S.',
	7: 'Macintosh',
	8: 'Z-System',
	9: 'CP/M',
	10: 'Windows NTFS',
	11: 'MVS (OS/390 - Z/OS)',
	12: 'VSE',
	13: 'Acorn Risc',
	14: 'VFAT',
	15: 'Alternate MVS',
	16: 'BeOS',
	17: 'Tandem',
	18: 'OS/400',
	19: 'OS X (Darwin)',
	20: 'Unknown', // 20+
};
ZipZippedFileSystemObjectHeader.supportedCompressionMethodsMap = [
	'none',
	'deflate',
];
ZipZippedFileSystemObjectHeader.compressionMethodMap = {
	0: 'none', // The file is stored (no compression)
	1: 'shrunk', // The file is Shrunk
	2: 'reduceWithCompressionFactor1', // The file is Reduced with compression factor 1
	3: 'reduceWithCompressionFactor2', // The file is Reduced with compression factor 2
	4: 'reduceWithCompressionFactor3', // The file is Reduced with compression factor 3
	5: 'reduceWithCompressionFactor4', // The file is Reduced with compression factor 4
	6: 'imploded', // The file is Imploded
	7: 'tokenized', // Reserved for Tokenizing compression algorithm
	8: 'deflate', // The file is Deflated
	9: 'enhancedDeflate', // Enhanced Deflating using Deflate64(tm)
	10: 'imploding', // PKWARE Data Compression Library Imploding (old IBM TERSE)
	11: 'unknown', // Reserved by PKWARE
	12: 'bzip2', // File is compressed using BZIP2 algorithm
	13: 'unknown', // Reserved by PKWARE
	14: 'lzma', // LZMA (EFS)
	15: 'unknown', // Reserved by PKWARE
	16: 'unknown', // Reserved by PKWARE
	17: 'unknown', // Reserved by PKWARE
	18: 'terse', // File is compressed using IBM TERSE (new)
	19: 'lz77', // IBM LZ77 z Architecture (PFS)
	97: 'wavPack', // WavPack compressed data
	98: 'ppmd', // PPMd version I, Rev 1
};
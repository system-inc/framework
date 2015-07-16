ZipCentralDirectoryZippedFileSystemObjectHeader = Class.extend({

	madeByInteger: null,
	madeByOperatingSystemInteger: null, // upper byte of madeBy
	madeByOperatingSystem: null,
	madeByZipVersionInteger: null, // lower byte of madeBy
	madeByZipVersion: null,

	minimumZipVersionNeededToExtractInteger: null,
	minimumZipVersionNeededToExtract: null,

	generalPurposeBitFlag: null,
	encrypted: null, // bit 0
	localFileSystemObjectHeaderHasSomePropertiesSetToZero: null,
	compressedPatchedData: null,
	usesStrongEncryption: null,
	usesUtf8: null,
	localFileSystemObjectHeaderMasksSomeProperties: null,

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
	commentSizeInBytes: null, // The length of the comment
	
	volumeNumberWhereZippedFileSystemObjectStarts: null, // The number of the volume on which this file system object exists

	internalAttributesInteger: null,
	apparentTextFile: null, // bit 0
	controlFieldRecordsPrecedeLogicalRecords: null, // bit 2

	externalAttributes: null, // External file attributes (host-system dependent)

	offsetToLocalZippedFileSystemObjectHeader: null, // This is the offset to the corresponding local file header from the start of the first volume
	
	path: null, // The path of the file system object including an optional relative path, all slashes in the path should be forward slashes '/'
	extraFields: [], // Used to store additional information, the field consistes of a sequence of header and data pairs, where the header has a 2 byte identifier and a 2 byte data size field
	comment: null, // An optional comment for the file system object

	sizeInBytes: null,

	construct: function() {
	},

	initializeFromBuffer: function(buffer, startOffset) {
		var actualSignature = buffer.readUInt32LE(startOffset);

		// Make sure the actual signature is valid
		if(actualSignature !== ZipCentralDirectoryZippedFileSystemObjectHeader.signature) {
			throw new Error('Invalid central directory file system object header, expected 0x'+ZipCentralDirectoryZippedFileSystemObjectHeader.signature.toString()+' but contained 0x'+actualSignature.toString()+'.');
		}

		// Read the made by integer
		this.madeByInteger = buffer.readUInt16LE(startOffset + 4);

		// Set the operating system the zip file was made by
		this.madeByOperatingSystemInteger = this.madeByInteger >> 8; // Read the upper byte
		if(ZipCentralDirectoryZippedFileSystemObjectHeader.madeByOperatingSystemMap[this.madeByOperatingSystemInteger]) {
			this.madeByOperatingSystem = ZipCentralDirectoryZippedFileSystemObjectHeader.madeByOperatingSystemMap[this.madeByOperatingSystemInteger];
		}
		else {
			this.madeByOperatingSystem = 'Unknown';
		}
		
		// Set the version the zip file was made by
		this.madeByZipVersionInteger = this.madeByInteger & 0xFF; // Read the lower byte
		this.madeByZipVersion = new Version({
			major: Number.round(this.madeByZipVersionInteger / 10),
			minor: this.madeByZipVersionInteger % 10,
		});

		this.minimumZipVersionNeededToExtractInteger =  buffer.readUInt16LE(startOffset + 6);
		this.minimumZipVersionNeededToExtract = new Version({
			major: Number.round(this.minimumZipVersionNeededToExtractInteger / 10),
			minor: this.minimumZipVersionNeededToExtractInteger % 10,
		});

		// Set the compression method
		this.compressionMethodInteger = buffer.readUInt16LE(startOffset + 10);
		if(ZipCentralDirectoryZippedFileSystemObjectHeader.compressionMethodMap[this.compressionMethodInteger]) {
			this.compressionMethod = ZipCentralDirectoryZippedFileSystemObjectHeader.compressionMethodMap[this.compressionMethodInteger]
		}
		if(!ZipCentralDirectoryZippedFileSystemObjectHeader.supportedCompressionMethodsMap.contains(this.compressionMethod)) {
			throw new Error('Zip file contains a file system object compressed with an unsupported compression method, "'+this.compressionMethod+'".')
		}

		// Stores various information about the file system object
		this.generalPurposeBitFlag = buffer.readUInt16LE(startOffset + 8);
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
		this.timeModifiedTimeInteger = buffer.readUInt16LE(startOffset + 12);
		this.timeModifiedDateInteger = buffer.readUInt16LE(startOffset + 14);
		this.timeModified = Time.constructFromDosDateTime(this.timeModifiedDateInteger, this.timeModifiedTimeInteger);

		this.crc32Checksum = buffer.readUInt32LE(startOffset + 16);
		this.compressedSizeInBytes = buffer.readUInt32LE(startOffset + 20);
		this.uncompressedSizeInBytes = buffer.readUInt32LE(startOffset + 24);
		this.pathSizeInBytes = buffer.readUInt16LE(startOffset + 28);
		this.extraFieldSizeInBytes = buffer.readUInt16LE(startOffset + 30);
		this.commentSizeInBytes = buffer.readUInt16LE(startOffset + 32);
		this.volumeNumberWhereZippedFileSystemObjectStarts = buffer.readUInt16LE(startOffset + 34);

		this.internalAttributes = buffer.readUInt16LE(startOffset + 36);
		var internalAttributesBit0 = this.generalPurposeBitFlag >> 0 & 1;
		var internalAttributesBit2 = this.generalPurposeBitFlag >> 2 & 1;
		this.apparentTextFile = internalAttributesBit0 ? true : false;
		this.controlFieldRecordsPrecedeLogicalRecords = internalAttributesBit2 ? true : false;

		this.externalAttributes = buffer.readUInt32LE(startOffset + 38);
		this.offsetToLocalZippedFileSystemObjectHeader = buffer.readUInt32LE(startOffset + 42);

		// Get the path
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

	toZippedFileSystemObject: function() {
		var zippedFileSystemObject;

		// If the path ends with / then the file system object is a directory
		if(this.path.endsWith('/')) {
			zippedFileSystemObject = new ZippedDirectory();
		}
		else {
			zippedFileSystemObject = new ZippedFile();
		}

		zippedFileSystemObject.centralDirectoryHeader = this;

		return zippedFileSystemObject;
	},

});

ZipCentralDirectoryZippedFileSystemObjectHeader.signature = 0x02014B50;
ZipCentralDirectoryZippedFileSystemObjectHeader.sizeInBytes = 46;
ZipCentralDirectoryZippedFileSystemObjectHeader.madeByOperatingSystemMap = {
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
ZipCentralDirectoryZippedFileSystemObjectHeader.supportedCompressionMethodsMap = [
	'none',
	'deflate',
];
ZipCentralDirectoryZippedFileSystemObjectHeader.compressionMethodMap = {
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

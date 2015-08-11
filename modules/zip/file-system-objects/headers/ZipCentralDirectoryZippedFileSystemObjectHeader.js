ZipCentralDirectoryZippedFileSystemObjectHeader = ZipZippedFileSystemObjectHeader.extend({

	madeByInteger: null,
	madeByOperatingSystemInteger: null, // upper byte of madeBy
	madeByOperatingSystem: null,
	madeByZipVersionInteger: null, // lower byte of madeBy
	madeByZipVersion: null,

	commentSizeInBytes: null, // The length of the comment
	
	volumeNumberWhereZippedFileSystemObjectStarts: null, // The number of the volume on which this file system object exists

	internalAttributesInteger: null,
	appearsToBeTextFile: null, // bit 0
	controlFieldRecordsPrecedeLogicalRecords: null, // bit 2

	externalAttributes: null, // External file attributes (host-system dependent)

	offsetToLocalZippedFileSystemObjectHeader: null, // This is the offset to the corresponding local file header from the start of the first volume
	
	comment: null, // An optional comment for the file system object

	initializeFromBuffer: function(buffer, startOffset) {
		this.super(buffer, startOffset, ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets, ZipCentralDirectoryZippedFileSystemObjectHeader.sizeInBytes);

		var actualSignature = buffer.readUInt32LE(startOffset);

		// Make sure the actual signature is valid
		if(actualSignature !== ZipCentralDirectoryZippedFileSystemObjectHeader.signature) {
			throw new Error('Invalid central directory file system object header, expected 0x'+ZipCentralDirectoryZippedFileSystemObjectHeader.signature.toString(16)+' but contained 0x'+actualSignature.toString(16)+'.');
		}

		// Read the made by integer
		this.madeByInteger = buffer.readUInt16LE(startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets.madeByInteger);

		// Set the operating system the zip file was made by
		this.madeByOperatingSystemInteger = this.madeByInteger >> 8; // Read the upper byte
		if(ZipZippedFileSystemObjectHeader.madeByOperatingSystemMap[this.madeByOperatingSystemInteger]) {
			this.madeByOperatingSystem = ZipZippedFileSystemObjectHeader.madeByOperatingSystemMap[this.madeByOperatingSystemInteger];
		}
		else {
			this.madeByOperatingSystem = 'Unknown';
		}
		
		// Set the version the zip file was made by
		this.madeByZipVersionInteger = this.madeByInteger & 0xff; // Read the lower byte
		this.madeByZipVersion = new Version({
			major: Number.round(this.madeByZipVersionInteger / 10),
			minor: this.madeByZipVersionInteger % 10,
		});

		this.commentSizeInBytes = buffer.readUInt16LE(startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets.commentSizeInBytes);

		this.volumeNumberWhereZippedFileSystemObjectStarts = buffer.readUInt16LE(startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets.volumeNumberWhereZippedFileSystemObjectStarts);

		this.internalAttributes = buffer.readUInt16LE(startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets.internalAttributes);
		var internalAttributesBit0 = this.generalPurposeBitFlag >> 0 & 1;
		var internalAttributesBit2 = this.generalPurposeBitFlag >> 2 & 1;
		this.appearsToBeTextFile = internalAttributesBit0 ? true : false;
		this.controlFieldRecordsPrecedeLogicalRecords = internalAttributesBit2 ? true : false;

		this.externalAttributes = buffer.readUInt32LE(startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets.externalAttributes);
		
		this.offsetToLocalZippedFileSystemObjectHeader = buffer.readUInt32LE(startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets.offsetToLocalZippedFileSystemObjectHeader);

		// Get the comment
		this.comment = buffer.toString('utf8', startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.sizeInBytes + this.pathSizeInBytes + this.extraFieldSizeInBytes, startOffset + ZipCentralDirectoryZippedFileSystemObjectHeader.sizeInBytes + this.pathSizeInBytes + this.extraFieldSizeInBytes + this.commentSizeInBytes);

		// Save the size of the entire header in bytes
		this.sizeInBytes = ZipCentralDirectoryZippedFileSystemObjectHeader.sizeInBytes + this.pathSizeInBytes + this.extraFieldSizeInBytes + this.commentSizeInBytes;
	},

});

// Static properties
ZipCentralDirectoryZippedFileSystemObjectHeader.signature = 0x02014b50;
ZipCentralDirectoryZippedFileSystemObjectHeader.sizeInBytes = 46;
ZipCentralDirectoryZippedFileSystemObjectHeader.bufferOffsets = {
	signature: 0,
	madeByInteger: 4,
	minimumZipVersionNeededToExtractInteger: 6,
	generalPurposeBitFlag: 8,
	archiveMethodInteger: 10,
	timeModifiedTimeInteger: 12,
	timeModifiedDateInteger: 14,
	crc32: 16,
	archivedSizeInBytes: 20,
	extractedSizeInBytes: 24,
	pathSizeInBytes: 28,
	extraFieldSizeInBytes: 30,
	commentSizeInBytes: 32,
	volumeNumberWhereZippedFileSystemObjectStarts: 34,
	internalAttributes: 36,
	externalAttributes: 38,
	offsetToLocalZippedFileSystemObjectHeader: 42,
};
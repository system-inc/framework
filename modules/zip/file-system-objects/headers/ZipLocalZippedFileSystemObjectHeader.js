ZipLocalZippedFileSystemObjectHeader = ZipZippedFileSystemObjectHeader.extend({

	initializeFromBuffer: function(buffer, startOffset) {
		this.super(buffer, startOffset, ZipLocalZippedFileSystemObjectHeader.bufferOffsets, ZipLocalZippedFileSystemObjectHeader.sizeInBytes);

		var actualSignature = buffer.readUInt32LE(startOffset);

		// Make sure the actual signature is valid
		if(actualSignature !== ZipLocalZippedFileSystemObjectHeader.signature) {
			throw new Error('Invalid local file system object header, expected 0x'+ZipLocalZippedFileSystemObjectHeader.signature.toString(16)+' but contained 0x'+actualSignature.toString(16)+'.');
		}

		// Save the size of the entire header in bytes
		this.sizeInBytes = ZipLocalZippedFileSystemObjectHeader.sizeInBytes + this.pathSizeInBytes + this.extraFieldSizeInBytes;
	},

	read: function*(offsetToLocalZippedFileSystemObjectHeader, zipFile) {
		// Read the local headerinto a buffer
		var buffer = yield zipFile.readToBuffer(ZipLocalZippedFileSystemObjectHeader.sizeInBytes, offsetToLocalZippedFileSystemObjectHeader);

		yield this.initializeFromBuffer(buffer, 0);

		return this;
	},

});

// Static properties
ZipLocalZippedFileSystemObjectHeader.signature = 0x04034b50;
ZipLocalZippedFileSystemObjectHeader.sizeInBytes = 30;
ZipLocalZippedFileSystemObjectHeader.bufferOffsets = {
	signature: 0,
	minimumZipVersionNeededToExtractInteger: 4,
	generalPurposeBitFlag: 6,
	compressionMethodInteger: 8,
	timeModifiedTimeInteger: 10,
	timeModifiedDateInteger: 12,
	crc32Checksum: 14,
	compressedSizeInBytes: 18,
	uncompressedSizeInBytes: 22,
	pathSizeInBytes: 26,
	extraFieldSizeInBytes: 28,
};
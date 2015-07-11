ZipEndOfCentralDirectoryRecord = Class.extend({

	zipFile: null,

	volumeNumberWhereCentralDirectoryEnds: null, // The number of the volume where the central directory ends
	volumeNumberWhereCentralDirectoryStarts: null, // The number of the volume where the central directory starts
	volumeEntriesCountWhereCentralDirectoryEnds: null, // The number of central directory entries on the volume where the central directory ends
	totalEntriesCount: null, // The total number of entries in the central directory
	centralDirectorySizeInBytes: null, // The size of the central directory in bytes
	offsetToCentralDirectory: null, // Offset of the start of the central directory on the volume on which the central directory starts
	commentSizeInBytes: null, // The size of the commend field in bytes
	comment: null, // An optional comment for the zip file

	construct: function(zipFile) {
		this.zipFile = zipFile;
	},

	read: function*() {
		// Initialize the status on the zip file if we need to
		if(!this.zipFile.statusInitialized) {
			yield this.zipFile.initializeStatus();
		}

		// Make sure the zip file has a size and meets the minimum size requirement
		if(!this.zipFile.size || this.zipFile.sizeInBytes() < ZipFile.minimumSizeInBytes) {
			throw new Error('Invalid zip file. A zip file must be at least '+ZipFile.minimumSizeInBytes+' bytes, the file provided is '+this.zipFile.size+' bytes.');
		}
		//Console.out('this.zipFile.sizeInBytes', this.zipFile.sizeInBytes());

		// Variable to store the end of central directory buffer
		var endOfCentralDirectoryRecordBuffer = null;

		// We will read the last bytes of the file and look for the end of directory signature
		var bytesToRead = ZipEndOfCentralDirectoryRecord.maximumSizeInBytes;
		if(bytesToRead > this.zipFile.sizeInBytes()) {
			bytesToRead = this.zipFile.sizeInBytes();
		}

		// Read the bytes
		var buffer = yield this.zipFile.readToBuffer(bytesToRead, this.zipFile.sizeInBytes() - bytesToRead);

		// Walk backwards looking for the end of central directory record signature
		var bytesProcessed = 0;
		for(var i = buffer.length - ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment; i >= 0; i--) {
			if(buffer.readUInt32LE(i) == ZipEndOfCentralDirectoryRecord.signature) {
				// When you find a candidate, get the byte 20 offset for the comment length
				var expectedCommentSizeInBytes = buffer.readUInt16LE(i + 20);
				//Console.highlight('Expected comment size in bytes', expectedCommentSizeInBytes, bytesProcessed);

				// The number of bytes we have processed so far should be the same as the comment size indicated in the end of central directory record
				if(expectedCommentSizeInBytes == bytesProcessed) {
					//Console.highlight('Possible end of central directory record found at '+i+'!');
					
					// Get just the part of the buffer that is the end of central directory record with comment
					endOfCentralDirectoryRecordBuffer = buffer.slice(i);
					break;
				}
			}

			bytesProcessed++;
		}

		// If we found an end of central directory record
		if(endOfCentralDirectoryRecordBuffer) {
			this.volumeNumberWhereCentralDirectoryEnds = endOfCentralDirectoryRecordBuffer.readUInt16LE(4);
			if(this.volumeNumberWhereCentralDirectoryEnds !== 0) {
				throw new Error('Multi-volume zip files are not supported yet, found volume number '+this.volumeNumberWhereCentralDirectoryEnds+'.');
			}

			this.volumeNumberWhereCentralDirectoryStarts = endOfCentralDirectoryRecordBuffer.readUInt16LE(6);
			this.volumeEntriesCountWhereCentralDirectoryEnds = endOfCentralDirectoryRecordBuffer.readUInt16LE(8);
			this.totalEntriesCount = endOfCentralDirectoryRecordBuffer.readUInt16LE(10);
			this.centralDirectorySizeInBytes = endOfCentralDirectoryRecordBuffer.readUInt32LE(12);
			this.offsetToCentralDirectory = endOfCentralDirectoryRecordBuffer.readUInt32LE(16);
			this.commentSizeInBytes = endOfCentralDirectoryRecordBuffer.readUInt16LE(20);

			// Read the comment as utf8 (maybe is cp437 encoded? will need to revisit)
			// https://github.com/thejoshwolfe/yauzl/issues/19#issuecomment-120487299
			if(this.commentSizeInBytes) {
				this.comment = endOfCentralDirectoryRecordBuffer.toString('utf8', ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment);
			}
		}
		// If we did not find an end of central directory record
		else {
			throw new Error('Invalid zip file. Could not find end of central directory record.');
		}

		// Confirm the start of the central directory (pointed to by the byte 12 offset) has an appropriate signature

	},

	sizeInBytes: function() {
		Console.out('sizeInBytes', ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment, '+', this.commentSizeInBytes, '=', ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment + this.commentSizeInBytes);
		return ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment + this.commentSizeInBytes;
	},

});

// Static properties
ZipEndOfCentralDirectoryRecord.signature = 0x06054b50; // The signature of end of central directory record, should always be \x50\x4b\x05\x06
ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment = 22;
ZipEndOfCentralDirectoryRecord.maximumCommentSizeInBytes = 0xFFFF; // 65535
ZipEndOfCentralDirectoryRecord.maximumSizeInBytes = ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment + ZipEndOfCentralDirectoryRecord.maximumCommentSizeInBytes;
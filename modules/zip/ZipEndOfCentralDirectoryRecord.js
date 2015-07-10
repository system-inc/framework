ZipEndOfCentralDirectoryRecord = Class.extend({

	zipFile: null,

	volumeNumberWhereCentralDirectoryEnds: null, // The number of the volume where the central directory ends
	volumeNumberWhereCentralDirectoryStarts: null, // The number of the volume where the central directory starts
	volumeEntriesCountWhereCentralDirectoryEnds: null, // The number of central directory entries on the volume where the central directory ends
	totalEntriesCount: null, // The total number of entries in the central directory
	centralDirectorySizeInBytes: null, // The size of the central directory in bytes
	offsetToStartOfCentralDirectory: null, // Offset of the start of the central directory on the volume on which the central directory starts
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
		Console.out('this.zipFile.sizeInBytes', this.zipFile.sizeInBytes());

		// Variable to store the end of central directory buffer
		var endOfCentralDirectoryBuffer = null;

		// Grab the last bytes of the file and look for the end of directory signature
		var buffer = yield this.zipFile.readToBuffer(ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment, this.zipFile.sizeInBytes() - ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment);
		
		// Check to see if we found the end of central directory record (this means there was no comment, we are banking on this being the most common case)
		if(buffer.readUInt32LE(0) == ZipEndOfCentralDirectoryRecord.signature) {
			endOfCentralDirectoryBuffer = buffer;
		}
		// If no end of central directory signature was found
		else {
			// Go back in 1024 byte chunks searching for it
			var finishedSearching = false;
			var searchedSizeInBytes = ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment;
			var searchBufferSizeInBytes = this.getIncrementedSearchBufferSizeInBytes(ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment);

			while(!endOfCentralDirectoryBuffer && !finishedSearching) {
				var searchOffset = this.zipFile.sizeInBytes() - searchedSizeInBytes - searchBufferSizeInBytes;
				var searchBuffer = yield this.zipFile.readToBuffer(searchBufferSizeInBytes, searchOffset);
				Console.out('searchBufferSizeInBytes', searchBufferSizeInBytes, 'searchOffset', searchOffset);

				// Add the newly read bytes to the front of the buffer
				buffer = Buffer.concatenate([
					searchBuffer,
					buffer,
				]);

				// Walk the searchBufferSizeInBytes looking for the end of central directory signature
				for(var i = 0; i < searchBufferSizeInBytes; i++) {
					if(buffer.readUInt32LE(i) == ZipEndOfCentralDirectoryRecord.signature) {
						Console.highlight('Found end of central directory record at '+i+'!');
						// Get just the part of the buffer that is the end of central directory record
						endOfCentralDirectoryBuffer = buffer.slice(i);
						break;
					}
				}

				// Break out of the while loop if we have found the end of central directory
				if(endOfCentralDirectoryBuffer) {
					break;
				}

				// Keep track of how many bytes we have searched
				searchedSizeInBytes += searchBufferSizeInBytes;

				// We are finished searching when we have checked every byte up to the maximum possible end of central directory size or the entire file size
				if(buffer.length >= ZipEndOfCentralDirectoryRecord.maximumSizeInBytes || buffer.length == this.zipFile.sizeInBytes()) {
					finishedSearching = true;
				}
				// If we haven't finished searching, keep going
				else {
					searchBufferSizeInBytes = this.getIncrementedSearchBufferSizeInBytes(searchBufferSizeInBytes);
				}
			}
		}


		// When you find a candidate, get the byte 20 offset for the comment length

		// Check if comment length + 20 matches your current count

		// Then check that the start of the central directory (pointed to by the byte 12 offset) has an appropriate signature


		//If you assumed the bits were pretty random when the signature check happened to be a wild guess (e.g. a guess landing
		// into a data segment), the probability of getting all the signature bits correct is pretty low. You could refine this
		// and figure out the chance of landing in a data segment and the chance of hitting a legitimate header (as a function of
		// the number of such headers), but this is already sounded like a low likelihood to me. You could increase your confidence
		// level by then checking the signature of the first file record listed, but be sure to handle the boundary case of an empty zip file.


		// If we found an end of central directory record and read it into a buffer
		if(endOfCentralDirectoryBuffer) {
			this.volumeNumberWhereCentralDirectoryEnds = endOfCentralDirectoryBuffer.readUInt16LE(4);
			if(this.volumeNumberWhereCentralDirectoryEnds !== 0) {
				throw new Error('Multi-volume zip files are not supported yet, found volume number '+this.volumeNumberWhereCentralDirectoryEnds+'.');
			}

			this.volumeNumberWhereCentralDirectoryStarts = endOfCentralDirectoryBuffer.readUInt16LE(6);
			this.volumeEntriesCountWhereCentralDirectoryEnds = endOfCentralDirectoryBuffer.readUInt16LE(8);
			this.totalEntriesCount = endOfCentralDirectoryBuffer.readUInt16LE(10);
			this.centralDirectorySizeInBytes = endOfCentralDirectoryBuffer.readUInt32LE(12);
			this.offsetToStartOfCentralDirectory = endOfCentralDirectoryBuffer.readUInt32LE(16);
			this.commentSizeInBytes = endOfCentralDirectoryBuffer.readUInt16LE(20);

			//var expectedCommentLength = eocdrBuffer.length - eocdrWithoutCommentSize;
			//if (commentLength !== expectedCommentLength) {
			//return callback(new Error("invalid comment length. expected: " + expectedCommentLength + ". found: " + commentLength));
			//}
			// 22 - Comment
			// the encoding is always cp437.
			//var comment = bufferToString(eocdrBuffer, 22, eocdrBuffer.length, false);

			if(this.commentSizeInBytes) {
				//this.comment = endOfCentralDirectoryBuffer.readUInt16LE(22);
			}
		}
		// If we did not find an end of central directory record
		else {
			throw new Error('Invalid zip file. Could not find end of central directory record.');
		}


		//// Open the zip file for reading
		//if(!this.zipFile.descriptor) {
		//	yield this.zipFile.open('r');
		//}

		//var buffer = yield this.zipFile.readToBuffer(length, position);
		//Console.highlight(buffer);




		  //// eocdr means End of Central Directory Record.
		  //// search backwards for the eocdr signature.
		  //// the last field of the eocdr is a variable-length comment.
		  //// the comment size is encoded in a 2-byte field in the eocdr, which we can't find without trudging backwards through the comment to find it.
		  //// as a consequence of this design decision, it's possible to have ambiguous zip file metadata if a coherent eocdr was in the comment.
		  //// we search backwards for a eocdr signature, and hope that whoever made the zip file was smart enough to forbid the eocdr signature in the comment.
		  //var eocdrWithoutCommentSize = 22;
		  //var maxCommentSize = 0x10000; // 2-byte size
		  //var bufferSize = Math.min(eocdrWithoutCommentSize + maxCommentSize, totalSize);
		  //var buffer = new Buffer(bufferSize);
		  //var bufferReadStart = totalSize - buffer.length;
		  //readAndAssertNoEof(reader, buffer, 0, bufferSize, bufferReadStart, function(err) {
		  //  if (err) return callback(err);
		  //  for (var i = bufferSize - eocdrWithoutCommentSize; i >= 0; i -= 1) {
		  //    if (buffer.readUInt32LE(i) !== 0x06054b50) continue;
		  //    // found eocdr
		  //    var eocdrBuffer = buffer.slice(i);
	},

	getIncrementedSearchBufferSizeInBytes: function(currentSizeInBytes) {
		var searchBufferSizeInBytes;
		var incrementSizeInBytes = 1024;

		if(currentSizeInBytes + incrementSizeInBytes > this.zipFile.sizeInBytes()) {
			searchBufferSizeInBytes = this.zipFile.sizeInBytes() - ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment;
		}
		else {
			searchBufferSizeInBytes = currentSizeInBytes + incrementSizeInBytes;
		}

		return searchBufferSizeInBytes;
	},

});

// Static properties
ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment = 22;
ZipEndOfCentralDirectoryRecord.maximumCommentSizeInBytes = 0xFFFF; // 65535
ZipEndOfCentralDirectoryRecord.maximumSizeInBytes = ZipEndOfCentralDirectoryRecord.sizeInBytesWithoutComment + ZipEndOfCentralDirectoryRecord.maximumCommentSizeInBytes;
ZipEndOfCentralDirectoryRecord.signature = 0x06054b50; // The signature of end of central directory record, should always be \x50\x4b\x05\x06
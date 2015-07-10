ZipEndOfCentralDirectoryRecord = Class.extend({

	zipFile: null,

	signature: null, // The signature of end of central directory record, should always be \x50\x4b\x05\x06
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
		Console.out('reading central directory');

		//http://stackoverflow.com/questions/8593904/how-to-find-the-position-of-central-directory-in-a-zip-file

		//// Open the zip file for reading
		//if(!this.zipFile.descriptor) {
		//	yield this.zipFile.open('r');
		//}

		//var buffer = yield this.zipFile.readToBuffer(length, position);
		//Console.highlight(buffer);




		//var i = inBuffer.length - Utils.Constants.ENDHDR, // END header size
  //          n = Math.max(0, i - 0xFFFF), // 0xFFFF is the max zip file comment length
  //          endOffset = -1; // Start offset of the END header

  //      for (i; i >= n; i--) {
  //          if (inBuffer[i] != 0x50) continue; // quick check that the byte is 'P'
  //          if (inBuffer.readUInt32LE(i) == Utils.Constants.ENDSIG) { // "PK\005\006"
  //              endOffset = i;
  //              break;
  //          }
  //      }
  //      if (!~endOffset)
  //          throw Utils.Errors.INVALID_FORMAT;

  //      mainHeader.loadFromBinary(inBuffer.slice(endOffset, endOffset + Utils.Constants.ENDHDR));
  //      if (mainHeader.commentLength) {
  //          _comment = inBuffer.slice(endOffset + Utils.Constants.ENDHDR);
  //      }
  //      readEntries();

		//// data should be 22 bytes and start with "PK 05 06"
		//if (data.length != Constants.ENDHDR || data.readUInt32LE(0) != Constants.ENDSIG)
		//throw Utils.Errors.INVALID_END;

		//// number of entries on this volume
		//_volumeEntries = data.readUInt16LE(Constants.ENDSUB);
		//// total number of entries
		//_totalEntries = data.readUInt16LE(Constants.ENDTOT);
		//// central directory size in bytes
		//_size = data.readUInt32LE(Constants.ENDSIZ);
		//// offset of first CEN header
		//_offset = data.readUInt32LE(Constants.ENDOFF);
		//// zip file comment length
		//_commentLength = data.readUInt16LE(Constants.ENDCOM);
	},

});
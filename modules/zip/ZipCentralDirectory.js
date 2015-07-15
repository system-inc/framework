ZipCentralDirectory = Class.extend({

	zipFile: null,

	fileSystemObjectHeaders: [],

	digitalSignature: null,
	zip64EndRecord: null,
	zip64EndLocator: null,

	endRecord: null,

	construct: function(zipFile) {
		this.zipFile = zipFile;
	},

	read: function*() {
		// Read the end of central directory record
		yield this.readEndRecord();

		// Read in the file system object headers
		yield this.readFileSystemObjectHeaders();
	},

	readEndRecord: function*() {
		this.endRecord = new ZipEndOfCentralDirectoryRecord(this.zipFile);
		yield this.endRecord.read();

		//Console.out(this.endRecord);

		return this.endRecord;
	},

	readFileSystemObjectHeaders: function*() {
		this.fileSystemObjectHeaders = [];

		// Read the central directory file system object headers into a buffer
		//Console.out('fileSystemObjectHeadersSizeInBytes', this.zipFile.sizeInBytes(), '-', this.endRecord.offsetToCentralDirectory, '-', this.endRecord.sizeInBytes(), '=', this.zipFile.sizeInBytes() - this.endRecord.offsetToCentralDirectory - this.endRecord.sizeInBytes());
		var fileSystemObjectHeadersSizeInBytes = this.zipFile.sizeInBytes() - this.endRecord.offsetToCentralDirectory - this.endRecord.sizeInBytes();
		//Console.highlight(this.endRecord.sizeInBytes());
		//Console.out('this.zipFile.sizeInBytes()', this.zipFile.sizeInBytes(), 'this.endRecord.offsetToCentralDirectory', this.endRecord.offsetToCentralDirectory, 'fileSystemObjectHeadersSizeInBytes', fileSystemObjectHeadersSizeInBytes);
		var buffer = yield this.zipFile.readToBuffer(fileSystemObjectHeadersSizeInBytes, this.endRecord.offsetToCentralDirectory);
		//Console.out('buffer.length', buffer.length);

		// Parse all of the entries
		var currentBufferPosition = 0;
		while(currentBufferPosition < buffer.length) {
			// Create the header using the buffer
			var fileSystemObjectHeader = new ZipCentralDirectoryFileSystemObjectHeader();
			fileSystemObjectHeader.initializeFromBuffer(buffer, currentBufferPosition);

			// Increment the current buffer position based on the size of the file system object header
			currentBufferPosition += fileSystemObjectHeader.sizeInBytes;
			//Console.out('currentBufferPosition', currentBufferPosition);

			// Add the header to the array
			this.fileSystemObjectHeaders.append(fileSystemObjectHeader);
		}
		//Console.out('this.fileSystemObjectHeaders.length', this.fileSystemObjectHeaders.length);

		// Confirm the entries read count is correct
		if(this.endRecord.totalEntriesCount != this.fileSystemObjectHeaders.length) {
			throw new Error('Invalid zip file, expected '+this.endRecord.totalEntriesCount+' entries, found '+this.fileSystemObjectHeaders.length+'.');
		}

		return this.fileSystemObjectHeaders;
	},

});
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

		Console.out(this.endRecord);

		return this.endRecord;
	},

	readFileSystemObjectHeaders: function*() {
		this.fileSystemObjectHeaders = [];

		// Read the central directory file system object headers into a buffer
		Console.out('bytesToRead', this.zipFile.sizeInBytes(), '-', this.endRecord.offsetToCentralDirectory, '-', this.endRecord.sizeInBytes(), '=', this.zipFile.sizeInBytes() - this.endRecord.offsetToCentralDirectory - this.endRecord.sizeInBytes());
		var bytesToRead = this.zipFile.sizeInBytes() - this.endRecord.offsetToCentralDirectory - this.endRecord.sizeInBytes();
		Console.highlight(this.endRecord.sizeInBytes());
		Console.out('this.zipFile.sizeInBytes()', this.zipFile.sizeInBytes(), 'this.endRecord.offsetToCentralDirectory', this.endRecord.offsetToCentralDirectory, 'bytesToRead', bytesToRead);
		var buffer = yield this.zipFile.readToBuffer(bytesToRead, this.endRecord.offsetToCentralDirectory);
		Console.out('buffer.length', buffer.length);

		// Parse all of the entries
		var currentBufferPosition = 0;
		while(currentBufferPosition <= buffer.length) {
			// Create the header using the buffer
			var fileSystemObjectHeader = new ZipCentralDirectoryFileSystemObjectHeader();
			fileSystemObjectHeader.initializeFromBuffer(buffer, currentBufferPosition);

			// Increment the current buffer position based on the size of the file system object header
			// Testing
			currentBufferPosition += 9999999999999999;

			// Add the header to the array
			this.fileSystemObjectHeaders.append(fileSystemObjectHeader);
		}

		return this.fileSystemObjectHeaders;
	},

});
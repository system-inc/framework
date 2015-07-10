ZipFile = File.extend({

	endOfCentralDirectoryRecord: null,

	fileSystemObjectReferences: [],

	readEndOfCentralDirectoryRecord: function*() {
		Console.out('reading end of central directory record');

		// Create and read the end of central directory record from the zip file
		this.endOfCentralDirectoryRecord = new ZipEndOfCentralDirectoryRecord(this);
		yield this.endOfCentralDirectoryRecord.read();
	},
	
	getFileSystemObjectReferences: function*() {
		// If the central directory has not been read, read it
		if(this.centralDirectoryHeader == null) {
			yield this.readEndOfCentralDirectoryRecord();
		}

		this.fileSystemObjectReferences = [];

		// Open the file


		// Go to the central directory

		// Read the entries out

		return this.fileSystemObjectReferences;
	},

});

// Alias list to getFileSystemObjectReferences
ZipFile.prototype.list = ZipFile.prototype.getFileSystemObjectReferences;
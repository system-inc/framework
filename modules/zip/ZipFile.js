ZipFile = File.extend({

	endOfCentralDirectoryRecord: null,

	zipFileSystemObjects: [],

	readEndOfCentralDirectoryRecord: function*() {
		// Create and read the end of central directory record from the zip file
		this.endOfCentralDirectoryRecord = new ZipEndOfCentralDirectoryRecord(this);
		yield this.endOfCentralDirectoryRecord.read();
	},
	
	getZipFileSystemObjects: function*() {
		// If the central directory has not been read, read it
		if(this.centralDirectoryHeader == null) {
			yield this.readEndOfCentralDirectoryRecord();
		}

		this.zipFileSystemObjects = [];


		// Go to the central directory

		// Read the entries out

		return this.zipFileSystemObjects;
	},

});

// Alias list to getZipFileSystemObjects
ZipFile.prototype.list = ZipFile.prototype.getZipFileSystemObjects;

// Static properties
ZipFile.minimumSizeInBytes = 22;
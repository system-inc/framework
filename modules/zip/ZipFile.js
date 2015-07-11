ZipFile = File.extend({

	centralDirectory: null,
	decryptionHeader: null,
	extraDataRecord: null,

	list: function*() {
		// If the central directory has not been read, read it
		if(!this.centralDirectory) {
			yield this.readCentralDirectory();
		}

		// Read the entries out of the central directory
		return [];
	},

	readCentralDirectory: function*() {
		// Create and read the end of central directory record from the zip file
		this.centralDirectory = new ZipCentralDirectory(this);
		yield this.centralDirectory.read();

		return this.centralDirectory;
	},

});

// Static properties
ZipFile.minimumSizeInBytes = 22;
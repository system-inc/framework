ZipFile = File.extend({

	centralDirectory: null,
	decryptionHeader: null,
	extraDataRecord: null,

	list: function*() {
		var list = [];

		// If the central directory has not been read, read it
		if(!this.centralDirectory) {
			yield this.readCentralDirectory();
		}

		// Create ZippedFileSystemObjects out of the headers
		this.centralDirectory.fileSystemObjectHeaders.each(function(index, centralDirectoryFileSystemObjectHeader) {
			list.append(centralDirectoryFileSystemObjectHeader.toZippedFileSystemObject());
		});

		return list;
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
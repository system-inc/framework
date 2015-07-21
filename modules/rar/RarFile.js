RarFile = ArchiveFile.extend({

	centralDirectory: null,
	decryptionHeader: null,
	extraDataRecord: null,

	readCentralDirectory: function*() {
		// Create and read the end of central directory record from the zip file
		this.centralDirectory = new ZipCentralDirectory(this);
		yield this.centralDirectory.read();

		return this.centralDirectory;
	},

	list: function*() {
		// If the central directory has not been read, read it
		if(!this.centralDirectory) {
			yield this.readCentralDirectory();
		}

		var list = [];

		// Create ZippedFileSystemObjects out of the central directory headers
		this.centralDirectory.zippedFileSystemObjectHeaders.each(function(index, centralDirectoryZippedFileSystemObjectHeader) {
			var zippedFileSystemObject = null;

			// If the path ends with / then the file system object is a directory
			if(centralDirectoryZippedFileSystemObjectHeader.path.endsWith('/')) {
				zippedFileSystemObject = new ZippedDirectory(this, centralDirectoryZippedFileSystemObjectHeader);
			}
			// If not, it is a file
			else {
				zippedFileSystemObject = new ZippedFile(this, centralDirectoryZippedFileSystemObjectHeader);
			}

			list.append(zippedFileSystemObject);
		}.bind(this));

		return list;
	},

});

// Static properties
RarFile.minimumSizeInBytes = 22;
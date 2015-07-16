ZipFile = File.extend({

	centralDirectory: null,
	decryptionHeader: null,
	extraDataRecord: null,

	comment: null,

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
				zippedFileSystemObject = new ZippedDirectory(this);
			}
			// If not, it is a file
			else {
				zippedFileSystemObject = new ZippedFile(this);
			}

			// Save a reference to the central directory header
			zippedFileSystemObject.centralDirectoryHeader = centralDirectoryZippedFileSystemObjectHeader;

			list.append(zippedFileSystemObject);
		}.bind(this));

		return list;
	},

	contains: function*(zippedFilePath) {
		// If the central directory has not been read, read it
		if(!this.centralDirectory) {
			yield this.readCentralDirectory();
		}

		var containsFile = false;
		this.centralDirectory.zippedFileSystemObjectHeaders.each(function(index, zippedFileSystemObjectHeaders) {
			if(zippedFilePath = zippedFileSystemObjectHeaders.path) {
				containsFile = true;
				return false; // break
			}
		});

		return containsFile;
	},

});

// Static properties
ZipFile.minimumSizeInBytes = 22;
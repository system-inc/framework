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

		// Create ZippedFileSystemObjects out of the headers
		this.centralDirectory.zippedFileSystemObjectHeaders.each(function(index, centralDirectoryZippedFileSystemObjectHeader) {
			list.append(centralDirectoryZippedFileSystemObjectHeader.toZippedFileSystemObject());
		});

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

	getZippedFileSystemObjectHeaderByPath: function*(path) {

	},

	extractFile: function*(zippedFilePath, destinationPath) {
		
	},

	fileToStream: function*(zippedFilePath) {
		// If the central directory has not been read, read it
		if(!this.centralDirectory) {
			yield this.readCentralDirectory();
		}

		// Get the file system object header
		var zippedFileSystemObjectHeader = this.getZippedFileSystemObjectHeaderByPath(zippedFilePath);

		// Read the 
	},

	extractFileToStream: function*(zippedFilePath, decompress) {
		decompress = decompress === undefined ? true : false; // true by default

		// If the central directory has not been read, read it
		if(!this.centralDirectory) {
			yield this.readCentralDirectory();
		}

		// Get the file system object header
		var zippedFileSystemObjectHeader = this.getZippedFileSystemObjectHeaderByPath(zippedFilePath);

		var stream = null;

		// If they want the file decompressed
		if(decompress) {

		}
		// If they do not want the file decompressed
		else {

		}

		return stream;
	},

});

// Static properties
ZipFile.minimumSizeInBytes = 22;
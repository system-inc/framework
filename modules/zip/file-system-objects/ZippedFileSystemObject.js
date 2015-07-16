ZippedFileSystemObject = Class.extend({

	zipFile: null,

	localHeader: null,
	centralDirectoryHeader: null,

	construct: function(zipFile) {
		this.zipFile = zipFile;
	},

	readLocalHeader: function*() {
		// Create a new local header
		this.localHeader = new ZipLocalZippedFileSystemObjectHeader();

		// Read the local header using a the offset from the central directory header and the zip file
		yield this.localHeader.read(this.centralDirectoryHeader.offsetToLocalZippedFileSystemObjectHeader, this.zipFile);

		return this.localHeader;
	},

	toReadStream: function*(decompress) {
		decompress = decompress === undefined ? true : false; // decompress by default

		// Read the local header if we need to
		if(!this.localHeader) {
			yield this.readLocalHeader();
		}

		// Create the read stream
		var readStream = yield this.zipFile.toReadStream({
			start: this.centralDirectoryHeader.offsetToLocalZippedFileSystemObjectHeader + this.localHeader.sizeInBytes,
			end: this.centralDirectoryHeader.offsetToLocalZippedFileSystemObjectHeader + this.localHeader.sizeInBytes + this.centralDirectoryHeader.compressedSizeInBytes,
		});

		// If they want the file decompressed
		if(decompress) {
			var deflate = Node.Zlib.createDeflate();
			readStream = readStream.pipe(deflate);
		}

		return readStream;
    },

});
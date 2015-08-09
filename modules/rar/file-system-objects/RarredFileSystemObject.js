RarredFileSystemObject = ArchivedFileSystemObject.extend({

	header: null,

	construct: function(archiveFile, header) {
		this.super.call(this, archiveFile);

		this.header = header;

		// Initialize class variables from central directory header
		this.path = this.header.path;
		this.compressionMethod = this.header.compressionMethod;
		this.compressionMethodOptions = this.header.compressionMethodOptions;
		this.compressedSizeInBytes = this.header.compressedSizeInBytes;
		this.uncompressedSizeInBytes = this.header.uncompressedSizeInBytes;
		this.comment = this.header.comment;

		// Just use time modified for all of these
		this.timeAccessed = this.header.timeModified;
		this.timeModified = this.header.timeModified;
		this.timeStatusChanged = this.header.timeModified;
		this.timeCreated = this.header.timeModified;

		// Use FileSystemObject's constructor to setup class variables based on path
		FileSystemObject.prototype.construct.call(this, this.path);
	},

	toReadStream: function*(decompress) {
		decompress = decompress === undefined ? true : false; // decompress by default

		// Read the local header if we need to
		if(!this.localHeader) {
			yield this.readLocalHeader();
		}

		// Create the read stream
		var readStream = yield this.archiveFile.toReadStream({
			start: this.header.offsetToLocalZippedFileSystemObjectHeader + this.localHeader.sizeInBytes,
			end: this.header.offsetToLocalZippedFileSystemObjectHeader + this.localHeader.sizeInBytes + this.header.compressedSizeInBytes,
		});

		// If they want the file decompressed
		if(decompress) {
			var deflate = Node.Zlib.createDeflate();
			readStream = readStream.pipe(deflate);
		}

		return readStream;
    },

});
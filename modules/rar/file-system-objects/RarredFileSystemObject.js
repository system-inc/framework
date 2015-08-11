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

		// The archived data begins at the end of the block header
		var start = this.header.offset + this.header.sizeInBytes;
		var end = start + this.header.compressedSizeInBytes - 1;

		// If the rarred file system object has no bytes
		if(end <= start) {
			return false;
		}
		else {
			// Create the read stream
			var readStream = yield this.archiveFile.toReadStream({
				start: start,
				end: end,
			});

			// If they want the file decompressed
			if(decompress) {
				// Need to extraction stream to pipe the read stream into

				//var deflate = Node.Zlib.createDeflate();
				//readStream = readStream.pipe(deflate);
			}

			return readStream;
		}
    },

    extract: function*() {
    	console.log('Extracting', this.path, 'compressed with', this.header.compressionMethod);

		var archiveMethodVersion = this.header.version;
		if(archiveMethodVersion < 15) {
			archiveMethodVersion = 15;
		}

		// RAR 1.5
		if(archiveMethodVersion == 15) {

		}
		// RAR 2.x and files larger than 2 GB
		else if(archiveMethodVersion == 20 || archiveMethodVersion == 26) {

		}
		// RAR 3.x and alternative hash
		else if(archiveMethodVersion == 29 || archiveMethodVersion == 36) {

		}
    },

});
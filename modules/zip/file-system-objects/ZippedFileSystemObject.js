ZippedFileSystemObject = ArchivedFileSystemObject.extend({

	localHeader: null,
	centralDirectoryHeader: null,

	construct: function(archiveFile, centralDirectoryHeader) {
		this.super.call(this, archiveFile);

		this.centralDirectoryHeader = centralDirectoryHeader;

		// Initialize class variables from central directory header
		this.path = this.centralDirectoryHeader.path;
		this.archiveMethod = this.centralDirectoryHeader.archiveMethod;
		this.archiveMethodOptions = this.centralDirectoryHeader.archiveMethodOptions;
		this.archivedSizeInBytes = this.centralDirectoryHeader.archivedSizeInBytes;
		this.extractedSizeInBytes = this.centralDirectoryHeader.extractedSizeInBytes;
		this.comment = this.centralDirectoryHeader.comment;

		// Just use time modified for all of these
		this.timeAccessed = this.centralDirectoryHeader.timeModified;
		this.timeModified = this.centralDirectoryHeader.timeModified;
		this.timeStatusChanged = this.centralDirectoryHeader.timeModified;
		this.timeCreated = this.centralDirectoryHeader.timeModified;

		// Use FileSystemObject's constructor to setup class variables based on path
		FileSystemObject.prototype.construct.call(this, this.path);
	},

	readLocalHeader: function*() {
		// Return the local header if it has already been read
		if(this.localHeader) {
			return this.localHeader;
		}

		// Create a new local header
		this.localHeader = new ZipLocalZippedFileSystemObjectHeader();

		// Read the local header using a the offset from the central directory header and the zip file
		yield this.localHeader.read(this.centralDirectoryHeader.offsetToLocalZippedFileSystemObjectHeader, this.archiveFile);

		return this.localHeader;
	},

	toReadStream: function*(decompress) {
		decompress = decompress === undefined ? true : false; // decompress by default

		// Read the local header if we need to
		if(!this.localHeader) {
			yield this.readLocalHeader();
		}

		// Create the read stream
		var readStream = yield this.archiveFile.toReadStream({
			start: this.centralDirectoryHeader.offsetToLocalZippedFileSystemObjectHeader + this.localHeader.sizeInBytes,
			end: this.centralDirectoryHeader.offsetToLocalZippedFileSystemObjectHeader + this.localHeader.sizeInBytes + this.centralDirectoryHeader.archivedSizeInBytes,
		});

		// If they want the file decompressed and the file is compressed
		if(decompress && this.archiveMethod == 'deflate') {
			var deflate = Node.Zlib.createDeflate();
			readStream = readStream.pipe(deflate);
		}

		return readStream;
    },

});
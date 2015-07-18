ZippedFileSystemObject = Class.extend({

	zipFile: null,

	type: null, // Either "file" or "directory"

	localHeader: null,
	centralDirectoryHeader: null,

	// References from central directory header
	compressionMethod: null,
	compressionMethodOptions: null,
	compressedSizeInBytes: null,
	uncompressedSizeInBytes: null,
	comment: null,
	path: null,

	// Mimic FileSystemObject
	name: null,
	directory: null,

	timeAccessed: null,
	timeModified: null,
	timeStatusChanged: null,
	timeCreated: null,

	construct: function(zipFile, centralDirectoryHeader) {
		this.zipFile = zipFile;
		this.centralDirectoryHeader = centralDirectoryHeader;

		// Initialize class variables from central directory header
		this.path = this.centralDirectoryHeader.path;
		this.compressionMethod = this.centralDirectoryHeader.compressionMethod;
		this.compressionMethodOptions = this.centralDirectoryHeader.compressionMethodOptions;
		this.compressedSizeInBytes = this.centralDirectoryHeader.compressedSizeInBytes;
		this.uncompressedSizeInBytes = this.centralDirectoryHeader.uncompressedSizeInBytes;
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

    isFile: function() {
		return Class.isInstance(this, ZippedFile);
	},

	isDirectory: function() {
		return Class.isInstance(this, ZippedDirectory);
	},

});
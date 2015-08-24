RarredFileSystemObject = ArchivedFileSystemObject.extend({

	header: null,

	construct: function(archiveFile, header) {
		this.super.call(this, archiveFile);

		this.header = header;

		// Initialize class variables from central directory header
		this.path = this.header.path;
		this.archiveMethod = this.header.archiveMethod;
		this.archiveMethodOptions = this.header.archiveMethodOptions;
		this.archivedSizeInBytes = this.header.archivedSizeInBytes;
		this.extractedSizeInBytes = this.header.extractedSizeInBytes;

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
		//Console.out('Extracting', this.path, 'compressed with', this.header.archiveMethod);
		decompress = decompress === undefined ? true : false; // decompress by default

		// The archived data begins at the end of the block header
		var start = this.header.offset + this.header.sizeInBytes;
		// TODO: Why do I have to -1 here and not in the block header?
		var end = start + this.header.archivedSizeInBytes - 1;

		// If the rarred file system object has no bytes
		if(end <= start) {
			return false;
		}
		else {
			// The read stream to return
			var readStream = yield this.archiveFile.toReadStream({
				start: start,
				end: end,
			});

			// If they want the file decompressed and the file is not archived with the store method
			if(decompress && this.header.archiveMethod != 'store') {
				// TODO: We should not do this
				var buffer = yield this.archiveFile.readToBuffer(this.archivedSizeInBytes, start);
				var extractRarStream = new ExtractRarStream(this, buffer);
				readStream = extractRarStream.buffer;

				// TODO: We should do this
				// Create an extract RAR stream to pipe the read stream to
				//var extractRarStream = new ExtractRarStream(this);
				//readStream = readStream.pipe(extractRarStream);
			}

			return readStream;
		}
    },

});
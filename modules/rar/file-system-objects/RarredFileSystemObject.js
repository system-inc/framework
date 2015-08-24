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

        ///////////////
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

        //////////////////////////////////////////////////////////////////////////////////
        /// here from ycm code ////

		console.log('Extracting', this.path, 'compressed with', this.header.archiveMethod);
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
			// Create the read stream
			var readStream = yield this.archiveFile.toReadStream({
				start: start,
				end: end,
			});

			// Determine the archive method version
			var archiveMethodVersion = this.header.version;
			if(archiveMethodVersion < 15) {
				archiveMethodVersion = 15;
			}

			// Set the extraction method
			var rarAlgorithm = null;

			// RAR 1.5
			if(archiveMethodVersion == 15) {
				rarAlgorithm = 'RAR 1.5';
			}
			// RAR 2.x and files larger than 2 GB
			else if(archiveMethodVersion == 20 || archiveMethodVersion == 26) {
				rarAlgorithm = 'RAR 2.x';
			}
			// RAR 3.x and alternative hash
			else if(archiveMethodVersion == 29 || archiveMethodVersion == 36) {
				rarAlgorithm = 'RAR 3.x';
			}

			// If they want the file decompressed and the file is not archived with the store method
			if(decompress && this.header.archiveMethod != 'store') {
				if(!rarAlgorithm) {
					throw new Error('Unable to extract '+this.path+' from RAR file '+this.archiveFile.path+' which is archived with archive method '+archiveMethodVersion+'.');
				}

				// Create an extract RAR stream to pipe the read stream to
				var extractRarStream = yield new ExtractRarStream(rarAlgorithm, start, this.archivedSizeInBytes, this.extractedSizeInBytes, this.archiveFile.file);
				readStream = extractRarStream;
			}


			return readStream;
		}
    },

});

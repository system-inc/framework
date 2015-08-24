RarFile = ArchiveFile.extend({

	header: null,
	blockHeaders: null,
	rarredFileSystemObjectHeaders: null,
	rarredFileSystemObjects: null,

	rarredFileSystemObjectsExtractedSizeInBytes: null,
	rarredFileSystemObjectsArchivedSizeInBytes: null,	

	readHeader: function*() {
		// Create and read the header
		this.header = new RarFileHeader(this);
		yield this.header.read();
		//Node.exit(this.header);

		return this.header;
	},

	readRarBlockHeaders: function*() {
		// If the header has not been read, read it
		if(!this.header) {
			yield this.readHeader();
		}

		// Initialize the headers arrays
		this.blockHeaders = [];
		this.rarredFileSystemObjectHeaders = [];

		// Track the data sizes
		this.rarredFileSystemObjectsExtractedSizeInBytes = 0;
		this.rarredFileSystemObjectsArchivedSizeInBytes = 0;

		// The offset starts at the first header
		var offset = this.header.offsetToFirstRarBlockHeader;

		// Jump from offset to offset reading in the headers
		while(offset < this.sizeInBytes()) {
			var blockHeader = yield this.readRarBlockHeader(offset);

			// Only add file system object headers with paths
			this.blockHeaders.append(blockHeader);
			if(blockHeader.type == 'rarredFileSystemObjectHeader') {
				this.rarredFileSystemObjectHeaders.append(blockHeader);

				this.rarredFileSystemObjectsExtractedSizeInBytes += blockHeader.extractedSizeInBytes;
				this.rarredFileSystemObjectsArchivedSizeInBytes += blockHeader.archivedSizeInBytes;
			}

			// Break out of the while loop if we hit a terminator
			if(blockHeader.type == 'terminator') {
				break;
			}

			// Set the offset to the next header
			offset += blockHeader.blockSizeInBytes;
		}

		//Console.highlight(this.rarredFileSystemObjectHeaders);

		return this.rarredFileSystemObjectHeaders;
	},

	readRarBlockHeader: function*(offset) {
		// Read the header
		var buffer = yield this.readToBuffer(RarBlockHeader.sizeInBytes, offset);

		var rarBlockHeader = new RarBlockHeader(this);
		yield rarBlockHeader.initializeFromBuffer(buffer, offset);

		return rarBlockHeader;
	},

	list: function*() {
		// If the header has not been read, read it
		if(!this.header) {
			yield this.readHeader();
		}

		// If the rarred file system object headers have not been read, read them
		if(!this.rarredFileSystemObjectHeaders) {
			yield this.readRarBlockHeaders();
			//Node.exit(this.rarredFileSystemObjectHeaders);
		}

		// If the rarred file system objects have not been created, create them
		if(!this.rarredFileSystemObjects) {
			this.rarredFileSystemObjects = [];

			// Create RarredFileSystemObjects out of the headers in the RAR file
			this.rarredFileSystemObjectHeaders.each(function(index, rarredFileSystemObjectHeader) {
				//Console.out(rarredFileSystemObjectHeader.path);
				//Console.out(rarredFileSystemObjectHeader.archiveMethod);
				var rarredFileSystemObject = null;

				// If the path ends with / then the file system object is a directory
				// TODO: this is a terrible way to check if it is a folder
				if(rarredFileSystemObjectHeader.dataCrc32 == 0 && rarredFileSystemObjectHeader.name.contains('.') == 0) {
					rarredFileSystemObject = new RarredDirectory(this, rarredFileSystemObjectHeader);
				}
				// If not, it is a file
				else {
					rarredFileSystemObject = new RarredFile(this, rarredFileSystemObjectHeader);
				}

				this.rarredFileSystemObjects.append(rarredFileSystemObject);
			}.bind(this));
		}

		return this.rarredFileSystemObjects;
	},

});

// Static properties
RarFile.minimumSizeInBytes = 20;
RarFile.signatures = [
	{
		version: new Version('1.5'),
		signature: 0x526172211a0700,
		sizeInBytes: 7,
	},
	{
		version: new Version('5.0'),
		signature: 0x526172211a070100,
		sizeInBytes: 8,
	},
];
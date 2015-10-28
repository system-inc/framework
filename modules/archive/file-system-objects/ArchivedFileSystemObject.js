ArchivedFileSystemObject = Class.extend({

	archiveFile: null,

	// Convenience property
	type: null, // Either "file" or "directory"

	// Mimic FileSystemObject properties
	name: null,
	directory: null,
	path: null,
	timeAccessed: null,
	timeModified: null,
	timeStatusChanged: null,
	timeCreated: null,

	readStream: null,

	// Archive properties
	archiveMethod: null,
	archiveMethodOptions: null,
	archivedSizeInBytes: null,
	extractedSizeInBytes: null,
	comment: null,

	construct: function(archiveFile, path) {
		this.archiveFile = archiveFile;

		// Use FileSystemObject's constructor to setup class variables based on path
		FileSystemObject.prototype.construct.call(this, path);
	},

	toReadStream: function*(options) {
        if(!this.readStream) {
            this.readStream = yield SevenZip.extract(this.archiveFile, this.path);
        }

        return this.readStream;
    },

    isFile: function() {
		return this.type == 'file';
	},

	isDirectory: function() {
		return this.type == 'directory';
	},

	sizeInBytes: function() {
		return this.archivedSizeInBytes;
	}

});

// Static methods
ArchivedFileSystemObject.constructFromSevenZipArchivedFileSystemObjectProperties = function(archiveFile, sevenZipArchivedFileSystemObjectProperties) {
	//Console.highlight('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);

	var archivedFileSystemObject = null;

	// Directories
	if(sevenZipArchivedFileSystemObjectProperties.folder == '+') {
		archivedFileSystemObject = new ArchivedDirectory(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
		//Console.out('ArchivedDirectory', archivedFileSystemObject);
	}
	// Files
	else {
		archivedFileSystemObject = new ArchivedFile(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
		//Console.out('ArchivedFile', archivedFileSystemObject);
	}

	archivedFileSystemObject.extractedSizeInBytes = sevenZipArchivedFileSystemObjectProperties.size;
	archivedFileSystemObject.archivedSizeInBytes = sevenZipArchivedFileSystemObjectProperties.packedSize;
	archivedFileSystemObject.timeAccessed = new Time(sevenZipArchivedFileSystemObjectProperties.accessed);
	archivedFileSystemObject.timeModified = new Time(sevenZipArchivedFileSystemObjectProperties.modified);
	archivedFileSystemObject.timeStatusChanged = new Time(sevenZipArchivedFileSystemObjectProperties.modified);
	archivedFileSystemObject.timeCreated = new Time(sevenZipArchivedFileSystemObjectProperties.created);
	archivedFileSystemObject.archiveMethod = sevenZipArchivedFileSystemObjectProperties.method.lowercase();
	archivedFileSystemObject.comment = sevenZipArchivedFileSystemObjectProperties.comment;
	//archivedFileSystemObject.version = sevenZipArchivedFileSystemObjectProperties.version;
	//archivedFileSystemObject.hostOperatingSystem = sevenZipArchivedFileSystemObjectProperties.hostOperatingSystem;
	//archivedFileSystemObject.encrypted = sevenZipArchivedFileSystemObjectProperties.encrypted;
	//archivedFileSystemObject.attributes = sevenZipArchivedFileSystemObjectProperties.attributes;
	//archivedFileSystemObject.crc = sevenZipArchivedFileSystemObjectProperties.crc;

	return archivedFileSystemObject;
}
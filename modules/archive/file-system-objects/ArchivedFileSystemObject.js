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

	// Archive properties
	compressionMethod: null,
	compressionMethodOptions: null,
	compressedSizeInBytes: null,
	uncompressedSizeInBytes: null,
	comment: null,

	construct: function(archiveFile) {
		this.archiveFile = archiveFile;
	},

	toReadStream: function*(decompress) {
		throw new Error('ArchivedFileSystemObject.toReadStream() must be implemented by all classes that extend ArchivedFileSystemObject.');
    },

    isFile: function() {
		return this.type == 'file';
	},

	isDirectory: function() {
		return this.type == 'directory';
	},

});
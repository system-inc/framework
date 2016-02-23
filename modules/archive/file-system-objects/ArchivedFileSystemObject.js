// Dependencies
var FileSystemObject = Framework.require('modules/file-system/FileSystemObject.js');
var SevenZip = Framework.require('modules/archive/libraries/7-zip/SevenZip.js');

// Class
var ArchivedFileSystemObject = Class.extend({

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

// Export
module.exports = ArchivedFileSystemObject;
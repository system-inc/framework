// Dependencies
var ArchivedFileSystemObject = Framework.require('system/archive/file-system-objects/ArchivedFileSystemObject.js');
var Directory = Framework.require('system/file-system/Directory.js');

// Class
var ArchivedDirectory = ArchivedFileSystemObject.extend({

	construct: function(archiveFile, path) {
		this.super.apply(this, arguments);

		this.type = 'directory';

		// Use Directory's constructor to setup class variables based on path
		Directory.prototype.construct.call(this, this.path);

		// Force all path separators to be forward slashes
		this.path = this.path.replace('\\', '/');
		this.directory = this.directory.replace('\\', '/');
	},

});

// Export
module.exports = ArchivedDirectory;
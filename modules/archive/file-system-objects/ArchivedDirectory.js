// Dependencies
var ArchivedFileSystemObject = Framework.require('modules/archive/file-system-objects/ArchivedFileSystemObject.js');

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
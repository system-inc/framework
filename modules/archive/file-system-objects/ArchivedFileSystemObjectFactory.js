// Class
var ArchivedFileSystemObjectFactory = {};

// Static methods
ArchivedFileSystemObjectFactory.create = function(archiveFile, path) {

	var archivedFileSystemObject = null;

	if(1) {
		var ArchivedFile = Framework.require('modules/archive/file-system-objects/ArchivedFile.js');
	}
	else {
		var ArchivedDirectory = Framework.require('modules/archive/file-system-objects/ArchivedDirectory.js');
	}
};

// Export
module.exports = ArchivedFileSystemObjectFactory;
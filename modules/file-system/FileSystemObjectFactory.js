// Class
var FileSystemObjectFactory = {};

// Static methods
FileSystemObjectFactory.create = function(archiveFile, path) {

	var fileSystemObject = null;

	if(1) {
		var File = Framework.require('modules/file-system/File.js');
	}
	else {
		var Directory = Framework.require('modules/file-system/Directory.js');
	}
};

// Export
module.exports = FileSystemObjectFactory;
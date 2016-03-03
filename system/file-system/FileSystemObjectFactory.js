// Class
var FileSystemObjectFactory = {};

// Static methods
FileSystemObjectFactory.create = function*(path) {
	// Make sure we have a path
	if(!path) {
		return null;
	}

	var fileSystemObject = null;

	var FileSystemObject = Framework.require('system/file-system/FileSystemObject.js');

	// Check to see if the file exists
	if(yield FileSystemObject.exists(path)) {
		// Get the file object status
		var nodeStatus = yield FileSystemObject.stat(path);

		// Make sure to always be an instance of File or Directory
		if(nodeStatus.isFile()) {
			var File = Framework.require('system/file-system/File.js');
			fileSystemObject = new File(path);
			yield fileSystemObject.initializeStatus();
		}
		else if(nodeStatus.isDirectory()) {
			var Directory = Framework.require('system/file-system/Directory.js');
			fileSystemObject = new Directory(path);
			yield fileSystemObject.initializeStatus();
		}
	}

	return fileSystemObject;
}.toPromise();

// Export
module.exports = FileSystemObjectFactory;
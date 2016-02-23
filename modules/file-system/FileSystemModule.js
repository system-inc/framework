// Globals
FileSystemObject = Framework.require('modules/file-system/FileSystemObject.js');
File = Framework.require('modules/file-system/File.js');
Directory = Framework.require('modules/file-system/Directory.js');

// Class
var FileSystemModule = Module.extend({

	version: new Version('0.1.0'),
	
});

// Export
module.exports = FileSystemModule;
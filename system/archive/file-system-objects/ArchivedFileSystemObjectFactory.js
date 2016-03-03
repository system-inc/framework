// Class
var ArchivedFileSystemObjectFactory = {};

// Static methods

ArchivedFileSystemObjectFactory.createFromSevenZipArchivedFileSystemObjectProperties = function(archiveFile, sevenZipArchivedFileSystemObjectProperties) {	
	//Console.highlight('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);

	var archivedFileSystemObject = null;

	// Directories
	if(sevenZipArchivedFileSystemObjectProperties.folder == '+') {
		var ArchivedDirectory = Framework.require('system/archive/file-system-objects/ArchivedDirectory.js');
		archivedFileSystemObject = new ArchivedDirectory(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
		//Console.log('ArchivedDirectory', archivedFileSystemObject);
	}
	// Files
	else {
		var ArchivedFile = Framework.require('system/archive/file-system-objects/ArchivedFile.js');
		archivedFileSystemObject = new ArchivedFile(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
		//Console.log('ArchivedFile', archivedFileSystemObject);
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
};

// Export
module.exports = ArchivedFileSystemObjectFactory;
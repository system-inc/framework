// Dependencies
//import ArchivedDirectory from 'framework/system/archive/file-system-objects/ArchivedDirectory.js';
//import ArchivedFile from 'framework/system/archive/file-system-objects/ArchivedFile.js';

// Class
class ArchivedFileSystemObjectFactory {

	static createFromSevenZipArchivedFileSystemObjectProperties(archiveFile, sevenZipArchivedFileSystemObjectProperties) {	
		//app.highlight('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);

		var archivedFileSystemObject = null;

		// Directories
		if(sevenZipArchivedFileSystemObjectProperties.folder == '+') {
			var ArchivedDirectory = require('framework/system/archive/file-system-objects/ArchivedDirectory.js').default;
			archivedFileSystemObject = new ArchivedDirectory(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
			//app.log('ArchivedDirectory', archivedFileSystemObject);
		}
		// Files
		else {
			var ArchivedFile = require('framework/system/archive/file-system-objects/ArchivedFile.js').default;
			archivedFileSystemObject = new ArchivedFile(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
			//app.log('ArchivedFile', archivedFileSystemObject);
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

}

// Export
export default ArchivedFileSystemObjectFactory;

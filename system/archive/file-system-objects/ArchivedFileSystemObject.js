// Dependencies
import { FileSystemObject } from '@framework/system/file-system/FileSystemObject.js';
import { SevenZip } from '@framework/system/archive/libraries/7-zip/SevenZip.js';

// Class
class ArchivedFileSystemObject {

	archiveFile = null;

	// Convenience property
	type = null; // Either "file" or "directory"

	// Mimic FileSystemObject properties
	name = null;
	directory = null;
	path = null;
	timeAccessed = null;
	timeModified = null;
	timeStatusChanged = null;
	timeCreated = null;

	readStream = null;

	// Archive properties
	archiveMethod = null;
	archiveMethodOptions = null;
	archivedSizeInBytes = null;
	extractedSizeInBytes = null;
	comment = null;

	constructor(archiveFile, path) {
		this.archiveFile = archiveFile;

		// Use FileSystemObject's initialize method to setup class variables based on path
		FileSystemObject.prototype.initializeFileSystemObject.call(this, path);
	}

	async toReadStream(options) {
        if(!this.readStream) {
            this.readStream = await SevenZip.extract(this.archiveFile, this.path);
        }

        return this.readStream;
    }

    isFile() {
		return this.type == 'file';
	}

	isDirectory() {
		return this.type == 'directory';
	}

	sizeInBytes() {
		return this.archivedSizeInBytes;
	}

	static async createFromSevenZipArchivedFileSystemObjectProperties(archiveFile, sevenZipArchivedFileSystemObjectProperties) {	
		//app.highlight('sevenZipArchivedFileSystemObjectProperties', sevenZipArchivedFileSystemObjectProperties);

		var archivedFileSystemObject = null;

		// Directories
		if(sevenZipArchivedFileSystemObjectProperties.folder == '+') {
			const { ArchivedDirectory } = await import('@framework/system/archive/file-system-objects/ArchivedDirectory.js');
			archivedFileSystemObject = new ArchivedDirectory(archiveFile, sevenZipArchivedFileSystemObjectProperties.path);
			//app.log('ArchivedDirectory', archivedFileSystemObject);
		}
		// Files
		else {
			const { ArchivedFile } = await import('@framework/system/archive/file-system-objects/ArchivedFile.js');
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
export { ArchivedFileSystemObject };

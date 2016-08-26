// Dependencies
import FileSystemObject from './../../../system/file-system/FileSystemObject.js';
import SevenZip from './../libraries/7-zip/SevenZip.js';

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

		// Use FileSystemObject's constructor to setup class variables based on path
		FileSystemObject.prototype.construct.call(this, path);
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

}

// Export
export default ArchivedFileSystemObject;

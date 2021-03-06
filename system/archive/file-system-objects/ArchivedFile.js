// Dependencies
import { ArchivedFileSystemObject } from '@framework/system/archive/file-system-objects/ArchivedFileSystemObject.js';
import { File } from '@framework/system/file-system/File.js';

// Class
class ArchivedFile extends ArchivedFileSystemObject {

	// Mimic File properties
	file = null;
	fileWithoutExtension = null;
	nameWithoutExtension = null;
	extension = null;

	constructor(archiveFile, path) {
		super(...arguments);

		this.type = 'file';

		// Use File's constructor to setup class variables based on path
		File.prototype.initializeFile.call(this, this.path);

		// Force all path separators to be forward slashes
		this.path = this.path.replace('\\', '/');
		this.directory = this.directory.replace('\\', '/');
		this.file = this.file.replace('\\', '/');
		this.fileWithoutExtension = this.fileWithoutExtension.replace('\\', '/');
	}

}

// Export
export { ArchivedFile };

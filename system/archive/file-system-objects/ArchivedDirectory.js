// Dependencies
import { ArchivedFileSystemObject } from '@framework/system/archive/file-system-objects/ArchivedFileSystemObject.js';
import { Directory } from '@framework/system/file-system/Directory.js';

// Class
class ArchivedDirectory extends ArchivedFileSystemObject {

	constructor(archiveFile, path) {
		super(...arguments);

		this.type = 'directory';

		// Use Directory's initialize to setup class variables based on path
		Directory.prototype.initializeDirectory.call(this, this.path);

		// Force all path separators to be forward slashes
		this.path = this.path.replace('\\', '/');
		this.directory = this.directory.replace('\\', '/');
	}

}

// Export
export { ArchivedDirectory };

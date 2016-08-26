// Dependencies
import ArchivedFileSystemObject from './ArchivedFileSystemObject.js';
import Directory from './../../../system/file-system/Directory.js';

// Class
class ArchivedDirectory extends ArchivedFileSystemObject {

	constructor(archiveFile, path) {
		super(...arguments);

		this.type = 'directory';

		// Use Directory's constructor to setup class variables based on path
		Directory.prototype.construct.call(this, this.path);

		// Force all path separators to be forward slashes
		this.path = this.path.replace('\\', '/');
		this.directory = this.directory.replace('\\', '/');
	},

}

// Export
export default ArchivedDirectory;

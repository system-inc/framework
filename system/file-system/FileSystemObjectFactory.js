// Dependencies
import FileSystemObject from './FileSystemObject.js';
import File from './File.js';
import Directory from './Directory.js';

// Class
class FileSystemObjectFactory {

	static async create(path) {
		// Make sure we have a path
		if(!path) {
			return null;
		}

		var fileSystemObject = null;

		// Check to see if the file exists
		if(await FileSystemObject.exists(path)) {
			// Get the file object status
			var nodeStatus = await FileSystemObject.stat(path);

			// Make sure to always be an instance of File or Directory
			if(nodeStatus.isFile()) {
				fileSystemObject = new File(path);
				await fileSystemObject.initializeStatus();
			}
			else if(nodeStatus.isDirectory()) {
				fileSystemObject = new Directory(path);
				await fileSystemObject.initializeStatus();
			}
		}

		return fileSystemObject;
	}

}

// Export
export default FileSystemObjectFactory;

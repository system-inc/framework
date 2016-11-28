// Dependencies
import FileSystemObject from 'framework/system/file-system/FileSystemObject.js';
import File from 'framework/system/file-system/File.js';
import Directory from 'framework/system/file-system/Directory.js';

// Class
class FileSystemObjectFactory {

	static async create(path) {
		//app.log('FileSystemObjectFactory.create', ...arguments);

		// Make sure we have a path
		if(!path) {
			throw new Error('No path provided at FileSystemObject.create(path).');
		}

		var fileSystemObject = null;

		// Get the file object status
		//app.log('calling FileSystemObject.stat');
		var nodeStatus = await FileSystemObject.stat(path);
		//app.log('nodeStatus', nodeStatus);

		// Make sure to always be an instance of File or Directory
		if(nodeStatus.isFile()) {
			fileSystemObject = new File(path);
			await fileSystemObject.initializeStatus();
		}
		else if(nodeStatus.isDirectory()) {
			fileSystemObject = new Directory(path);
			await fileSystemObject.initializeStatus();
		}

		return fileSystemObject;
	}

}

// Export
export default FileSystemObjectFactory;

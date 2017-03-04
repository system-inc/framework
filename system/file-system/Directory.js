// Dependencies
import FileSystemObject from 'framework/system/file-system/FileSystemObject.js';

// Class
class Directory extends FileSystemObject {

	constructor(path) {
		//console.log('Directory.constructor path', path);
		super(...arguments);
		//console.log('Directory.constructor this.path', this.path);

		this.initializeDirectory();
	}

	initializeDirectory() {
		//console.log('Directory.initializeDirectory', this.path, arguments);

		// Make sure directories always end with a separator
		if(!this.path.endsWith(Node.Path.separator)) {
			this.path = this.path+Node.Path.separator
		}
	}

	async list(recursive, filteringFunction) {
		var list = await FileSystemObject.list(this.path, recursive, filteringFunction);

		return list;
	}

	async create(directory = this.path, mode) {
		//console.log('Creating directory: ', directory);

		// Normalize the path for the operating system
		var directory = Node.Path.normalize(directory);
		
		// Remove any beginning separators
		if(directory.startsWith(Node.Path.separator)) {
			directory = directory.replaceFirst(Node.Path.separator, '');
		}
		// Remove any ending separators
		if(directory.endsWith(Node.Path.separator)) {
			directory = directory.replaceLast(Node.Path.separator, '');
		}
		//console.log('directory', directory);

		var directories = directory.split(Node.Path.separator);

		// Start at root
		var currentFullDirectory = Node.Path.separator;

		// Handle drive lettes in Windows ("C:")
		var firstDirectory = directories.first();
		if(firstDirectory.contains(':')) {
			currentFullDirectory = firstDirectory+Node.Path.separator;
			directories.shift();
		}

		// Loop through each directory starting at root and make sure the directory exists and if it doesn't create it
		await directories.each(async function(index, currentDirectory) {
			currentFullDirectory = currentFullDirectory+currentDirectory+Node.Path.separator;
			//console.log('currentFullDirectory', currentFullDirectory);

			// Check if the directory exists
			if(await Directory.exists(currentFullDirectory)) {
				//console.log(currentFullDirectory, 'exists');
			}
			// If the directory does not exist, create it
			else {
				//console.log(currentFullDirectory, 'DOES NOT exist, creating');
				await Directory.make(currentFullDirectory, mode);
				//console.log('Created directory', currentFullDirectory);
			}
		});
	}

	static create = Directory.prototype.create;

	static async make(path, mode) {
		var made = false;

		try {
			Node.FileSystem.mkdirSync(path, mode);
			made = true;
		}
		catch(error) {
			// Return true if the directory exists
			if(error.code == 'EEXIST') {
				made = true;
			}
			else {
				made = false;	
			}
		}

	    return made;
	}

	static is(value) {
		return value instanceof Directory;
	}

}

// Export
export default Directory;

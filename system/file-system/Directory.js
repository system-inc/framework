// Dependencies
var FileSystemObject = Framework.require('system/file-system/FileSystemObject.js');

// Class
var Directory = FileSystemObject.extend({

	construct: function(path) {
		this.super.apply(this, arguments);

		// Make sure directories always end with a separator
		if(!this.path.endsWith(Node.Path.separator)) {
			this.path = this.path+Node.Path.separator
		}
	},

	list: function*(recursive) {
		var list = yield FileSystemObject.list(this.path, recursive);

		return list;
	},

	create: function*(directory, mode) {
		//Console.log('Creating directory: ', directory);

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
		//Console.log(directory);

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
		yield directories.each(function*(index, currentDirectory) {
			currentFullDirectory = currentFullDirectory+currentDirectory+Node.Path.separator;
			//Console.log(currentFullDirectory);

			// Check if the directory exists
			if(yield Directory.exists(currentFullDirectory)) {
				//Console.log(currentFullDirectory, 'exists');
			}
			// If the directory does not exist, create it
			else {
				//Console.log(currentFullDirectory, 'DOES NOT exist, creating');
				yield Directory.make(currentFullDirectory, mode);
				//Console.log('Created directory', currentFullDirectory);
			}
		});
	},

});

// Static methods
Directory.create = Directory.prototype.create;

Directory.make = function(path, mode) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.mkdir(path, mode, function(error) {
    		if(error) {
    			// Return true if the directory exists
    			if(error.code == 'EEXIST') {
    				resolve(true);
    			}
    			else {
    				reject(error);	
    			}
    		}
    		else {
    			resolve(true);
    		}
    	});
    });
};

// Export
module.exports = Directory;
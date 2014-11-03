Directory = FileSystemObject.extend({

	list: function*(directory) {
		// Use the directory they passed in (if they called list() statically) or try to use the directory if this is an instantiated object
		directory = ((directory === undefined) ? ((this.directory === undefined) ? null : this.directory) : directory);

		// Sanity check the directory
		if(!directory) {
			return false;
		}

		var list = [];

		var listStringArray = yield FileSystem.list(directory);

		// If list call works
		if(listStringArray) {
			// Loop through the string array and make the directory and file objects
			for(var i = 0; i < listStringArray.length; i++) {
				list.push(yield FileSystemObject.constructFromPath(directory+listStringArray[i]));
			}
		}
		// If list call does not work
		else {
			list = false;
		}		

		return list;
	},

	create: function*(directory, mode) {
		// Normalize the path for the operating system
		var directory = Node.Path.normalize(directory);
		
		// Remove any beginning separators
		if(directory.startsWith(Node.Path.sep)) {
			directory = directory.replaceFirst(Node.Path.sep, '');
		}
		// Remove any ending separators
		if(directory.endsWith(Node.Path.sep)) {
			directory = directory.replaceLast(Node.Path.sep, '');
		}
		//Console.out(directory);

		var directories = directory.split(Node.Path.sep);
		//Console.out(directories);

		// Loop through each directory starting at root and make sure the directory exists and if it doesn't create it
		var currentFullDirectory = '/';
		yield directories.each(function*(index, currentDirectory) {
			currentFullDirectory = currentFullDirectory+currentDirectory+Node.Path.sep;

			// Check if the directory exists
			if(yield Directory.exists(currentFullDirectory)) {
				//console.log(currentFullDirectory, 'exists');
			}
			// If the directory does not exist, create it
			else {
				//console.log(currentFullDirectory, 'DOES NOT exist, creating');
				yield Directory.make(currentFullDirectory, mode);
				Console.out('Created directory', currentFullDirectory);
			}
		});
	},

});

// Static methods
Directory.list = Directory.prototype.list;
Directory.create = Directory.prototype.create;
//Directory.make = Promise.promisify(Node.FileSystem.mkdir);
Directory.make = Promise.method(function(path, mode) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.mkdir(path, mode, function(error) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(true);
    		}
    	});
    });
});
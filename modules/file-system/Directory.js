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
		var directory = NodePath.normalize(directory);
		
		// Remove any beginning separators
		if(directory.startsWith(NodePath.sep)) {
			directory = directory.replaceFirst(NodePath.sep, '');
		}
		// Remove any ending separators
		if(directory.endsWith(NodePath.sep)) {
			directory = directory.replaceLast(NodePath.sep, '');
		}
		//Console.out(directory);

		var directories = directory.split(NodePath.sep);
		//Console.out(directories);

		// Loop through each directory starting at root and make sure the directory exists and if it doesn't create it
		var currentFullDirectory = '/';
		yield directories.each(function*(currentDirectory) {
			currentFullDirectory = currentFullDirectory+currentDirectory+NodePath.sep;

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
//Directory.make = Promise.promisify(NodeFileSystem.mkdir);
Directory.make = Promise.method(function(path, mode) {
    return new Promise(function(resolve, reject) {
    	NodeFileSystem.mkdir(function(error) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(true);
    		}
    	});
    });
});
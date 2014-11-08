Directory = FileSystemObject.extend({

	construct: function(path) {
		this.super.apply(this, arguments);

		// Make sure directories always end with a separator
		if(!this.path.endsWith(Node.Path.sep)) {
			this.path = this.path+Node.Path.sep
		}
	},

	list: function*(recursive) {
		var list = yield FileSystem.list(this.path, recursive);

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
Directory.create = Directory.prototype.create;

Directory.make = function(path, mode) {
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
}
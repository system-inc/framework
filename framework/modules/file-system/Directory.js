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

});

// Static methods
Directory.list = Directory.prototype.list;
Directory = FileSystemObject.extend({

	list: function*(path) {
		// Use the path they passed in (if they called list() statically) or try to use the path if this is an instantiated object
		path = ((path === undefined) ? ((this.path === undefined) ? null : this.path) : path);

		// Sanity check the path
		if(!path) {
			return false;
		}

		var list = [];

		var listStringArray = yield FileSystem.list(path);

		// Loop through the string array and make the directory and file objects
		for(var i = 0; i < listStringArray.length; i++) {
			list.push(yield FileSystemObject.constructFromPath(path+listStringArray[i]));
		}

		return list;
	},

});

// Static methods
Directory.list = Directory.prototype.list;
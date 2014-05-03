Directory = FileSystemObject.extend({

	list: function*(path) {
		yield new Promise(function(resolve) {
			Generator.run(function*(path) {
				// Use the path they passed in (if they called list() statically) or try to use the path this is an instantiated object
				path = ((path === undefined) ? ((this.path === undefined) ? null : this.path) : path);

				// Sanity check the path
				if(!path) {
					return resolve(false);
				}

				var list = [];

				// Yielding async call
				var listStringArray = yield PromiseFileSystem.readdirAsync(path);

				// Loop through the string array and make the directory and file objects
				for(var i = 0; i < listStringArray.length; i++) {
					list.push(FileSystemObject.constructFromPath(path+listStringArray[i]));
				}

				return resolve(list);
			}(path));
		});
	},

});

// Static methods
Directory.list = Directory.prototype.list;
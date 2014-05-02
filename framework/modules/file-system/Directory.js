Directory = FileSystemObject.extend({

	list: function*(path) {
		// Use the path they passed in (if they called list() statically) or try to use the path this is an instantiated object
		path = ((path === undefined) ? ((this.path === undefined) ? null : this.path) : path);

		// Sanity check the path
		if(!path) {
			return false;
		}

		var list = [];

		// Using sync call
		// var listStringArray = NodeFileSystem.readdirSync(path);
		// console.log('Directory.list listStringArray:', listStringArray);

		// Using async call
		// NodeFileSystem.readdir(path, function(error, listStringArray) {
		// 	console.log('Directory.list listStringArray:', listStringArray);
		// });

		// Yielding async call
		yield 'Stop 1';
		yield 'Stop 1.5';
		var listStringArray = yield PromiseFileSystem.readdirAsync(path);
		console.log('Directory.list listStringArray:', listStringArray);
		yield 'Stop 2';

		// Loop through the string array and make the directory and file objects
		// for(var i = 0; i < listStringArray.length; i++) {
		// 	list.push(FileSystemObject.constructFromPath(path+listStringArray[i]));
		// 	list.push(listStringArray[i]);
		// }
		//console.log(list);

		return list;
	},

});

// Static methods
Directory.list = Directory.prototype.list;
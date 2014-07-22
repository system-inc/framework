File = FileSystemObject.extend({

	file: null, // The full path to the file, e.g., /directory/file.extension; same as path

	construct: function(path) {
		this.super(path);
		this.file = (path === undefined ? null : path);
	},

	getContentType: function(file) {
		var contentType = 'application/octet-stream';
		var extension = file.split('.').reverse()[0];
		
		if(FileFormats[extension]) {
			contentType = FileFormats[extension].type;
		}

		return contentType;
	},

});

// Static methods
File.getContentType = File.prototype.getContentType;
File.exists = Promise.method(function(file) {
    return new Promise(function(resolve, reject) {
    	NodeFileSystem.exists(file, function(exists) {
    		resolve(exists);
    	});
    });
});
File.read = Promise.promisify(NodeFileSystem.readFile);
File.open = Promise.promisify(NodeFileSystem.open);
File.write = Promise.promisify(NodeFileSystem.write);
File.synchronous = {};
File.synchronous.exists = NodeFileSystem.existsSync;
File.synchronous.read = NodeFileSystem.readFileSync;
File.synchronous.readJson = function(file) {
	var result = {};

	if(File.synchronous.exists(file)) {
		// Read the file
		var json = File.synchronous.read(file).toString();

		// Make sure we have JSON
		if(Json.is(json)) {
			result = Json.decode(json);
		}
	}

	return result;
}
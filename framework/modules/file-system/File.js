File = FileSystemObject.extend({

	getContentType: function(path) {
		var contentType = 'application/octet-stream';
		var extension = path.split('.').reverse()[0];
		
		if(FileFormats[extension]) {
			contentType = FileFormats[extension].type;
		}

		return contentType;
	},

});

// Static methods
File.getContentType = File.prototype.getContentType;
File.exists = Promise.method(function(path) {
    return new Promise(function(resolve, reject) {
    	NodeFileSystem.exists(path, function(exists) {
    		resolve(exists);
    	});
    });
});
File.read = Promise.promisify(NodeFileSystem.readFile);
File.synchronous = {};
File.synchronous.exists = NodeFileSystem.existsSync;
File.synchronous.read = NodeFileSystem.readFileSync;
File.synchronous.readJson = function(path) {
	var result = {};

	if(File.synchronous.exists(path)) {
		// Read the file
		var json = File.synchronous.read(path).toString();

		// Make sure we have JSON
		if(Json.is(json)) {
			result = Json.decode(json);
		}
	}

	return result;
}
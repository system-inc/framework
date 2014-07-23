File = FileSystemObject.extend({

	file: null, // The full path to the file, e.g., /directory/file.extension; same as path
	fileWithoutExtension: null, // The full path the file without the extension
	nameWithoutExtension: null,
	extension: null,
	handle: null,

	construct: function(path) {
		this.super(path);
		this.file = (path === undefined ? this.path : path);

		this.fileWithoutExtension = this.file.substr(0, this.file.lastIndexOf('.'));
		this.nameWithoutExtension = this.name.substr(0, this.name.lastIndexOf('.'));
		this.extension = this.file.split('.').reverse()[0];
	},

	getContentType: function(file) {
		var contentType = 'application/octet-stream';
		
		if(FileFormats[this.extension]) {
			contentType = FileFormats[this.extension].type;
		}

		return contentType;
	},

	open: function*(flags) {
		console.log('Running file.open on ', this.file, 'with flags', flags);
		this.handle = yield File.open(this.file, flags);

		return this.handle;
	},

	write: function*(data) {
		console.log('Running file.write', 'with handle', this.handle, data);
		File.write(this.handle, data);
	},

});

// Static methods
File.getContentType = File.prototype.getContentType;
File.read = Promise.promisify(NodeFileSystem.readFile);
File.open = Promise.promisify(NodeFileSystem.open);
File.write = Promise.promisify(NodeFileSystem.write);
File.createWriteStream = Promise.method(function() {
	var storedContext = this;
	var storedArguments = arguments;

    return new Promise(function(resolve, reject) {
    	var writeStream = NodeFileSystem.createWriteStream.apply(storedContext, storedArguments);
    	writeStream.on('open', function(fileDescriptor) {
    		resolve(writeStream);
    	});
    	writeStream.on('error', function(error) {
    		console.log(error);
    		reject(error);
    	});
    });
});
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
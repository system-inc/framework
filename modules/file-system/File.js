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
        var context = this;

        // If this method is being invoked statically
        if(file) {
            context = new File(file);
        }

        // Set the default content type
		var contentType = 'application/octet-stream';

        // Check if the extension is defined in our file formats
		if(FileFormats[context.extension]) {
			contentType = FileFormats[context.extension].type;
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

//File.read = Promise.promisify(Node.FileSystem.readFile);
File.read = function(fileName, options) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.readFile(fileName, options, function(error, data) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(data);
    		}
    	});
    });
}

//File.open = Promise.promisify(Node.FileSystem.open);
File.open = function(path, flags, mode) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.open(path, flags, mode, function(error, fileDescriptor) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(fileDescriptor);
    		}
    	});
    });
}

//File.write = Promise.promisify(Node.FileSystem.write);
File.write = function(fileDescriptor, buffer, offset, length, position) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.write(fileDescriptor, buffer, offset, length, position, function(error, written, buffer) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve({
    				'written': written,
    				'buffer': buffer,
    			});
    		}
    	});
    });
}

File.create = function(file, data, options) {
    return new Promise(function(resolve, reject) {
        Node.FileSystem.writeFile(file, data, options, function(error) {
            if(error) {
                reject(error);
            }
            else {
                resolve(true);
            }
        });
    });
}

File.createWriteStream = function() {
	var storedContext = this;
	var storedArguments = arguments;

    return new Promise(function(resolve, reject) {
    	var writeStream = Node.FileSystem.createWriteStream.apply(storedContext, storedArguments);
    	writeStream.on('open', function(fileDescriptor) {
    		resolve(writeStream);
    	});
    	writeStream.on('error', function(error) {
    		console.log(error);
    		reject(error);
    	});
    });
}

File.synchronous = {};

File.synchronous.exists = Node.FileSystem.existsSync;

File.synchronous.read = Node.FileSystem.readFileSync;

File.synchronous.read.json = function(file) {
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
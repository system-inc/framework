// Dependencies
var FileSystemObject = Framework.require('modules/file-system/FileSystemObject.js');
var FileFormats = Framework.require('modules/file-system/FileFormats.js');

// Class
var File = FileSystemObject.extend({

	file: null, // The full path to the file, e.g., /directory/file.extension; same as path
	fileWithoutExtension: null, // The full path the file without the extension
	nameWithoutExtension: null,
	extension: null,
	descriptor: null,

	construct: function(path) {
		this.super.apply(this, arguments);
		
        this.file = this.path;

        // Handle files starting with ., such as .DS_Store , or files without extensions
        if((this.name.startsWith('.') && this.name.contains('.') == 1) || this.name.contains('.') == 0) {
            this.fileWithoutExtension = this.file;
            this.nameWithoutExtension = this.name;
            this.extension = '';
        }
        else {
            this.extension = this.name.split('.').reverse()[0];
            this.nameWithoutExtension = this.name.substr(0, this.name.lastIndexOf('.'));
            this.fileWithoutExtension = this.directory+this.nameWithoutExtension;
        }
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
		//Console.log('Running file.open on', this.file, 'with flags', flags);
		this.descriptor = yield File.open(this.file, flags);

		return this.descriptor;
	},

    read: function*(options) {
        var content = yield File.read(this.path, options);

        return content;
    },

    readToBuffer: function*(length, position) {
        //Console.log('length', length, 'position', position);
        
        // If there is no file descriptor, open the file in read only mode
        if(!this.descriptor) {
            yield this.open('r');
            //Console.log('Opened file in read mode', this.descriptor);
        }

        return new Promise(function(resolve, reject) {
            var bufferToUse = new Buffer(length);

            Node.FileSystem.read(this.descriptor, bufferToUse, 0, length, position, function(error, bytesRead, buffer) {
                if(error) {
                    reject(error);
                }
                else {
                    //Console.log('bytesRead', bytesRead);
                    resolve(buffer);
                }
            });
        }.bind(this));
    },

	write: function*(data) {
		//Console.log('Running file.write', 'with descriptor', this.descriptor, data);
		var response = yield File.write(this.descriptor, data);

        return response;
	},

    toReadStream: function*(options) {
        if(!this.readStream) {
            this.readStream = yield File.createReadStream(this.path, options);
        }

        return this.readStream;
    },

    toWriteStream: function*(options) {
        var writeStream = yield File.createWriteStream(this.path, options);

        return writeStream;
    },

});

// Static methods
File.getContentType = File.prototype.getContentType;

File.read = function(path, options) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.readFile(path, options, function(error, data) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(data);
    		}
    	});
    });
};

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
};

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
};

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
};

File.createReadStream = function() {
    var storedContext = this;
    var storedArguments = arguments;

    return new Promise(function(resolve, reject) {
        var readStream = Node.FileSystem.createReadStream.apply(storedContext, storedArguments);
        readStream.on('open', function(fileDescriptor) {
            resolve(readStream);
        });
        readStream.on('error', function(error) {
            Console.error(error);
            reject(error);
        });
    });
};

File.createWriteStream = function() {
	var storedContext = this;
	var storedArguments = arguments;

    return new Promise(function(resolve, reject) {
    	var writeStream = Node.FileSystem.createWriteStream.apply(storedContext, storedArguments);
    	writeStream.on('open', function(fileDescriptor) {
    		resolve(writeStream);
    	});
    	writeStream.on('error', function(error) {
    		Console.error(error);
    		reject(error);
    	});
    });
};

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
};

// Export
module.exports = File;
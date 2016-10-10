// Dependencies
import FileSystemObject from './FileSystemObject.js';
import FileFormats from './FileFormats.js';

// Class
class File extends FileSystemObject {

	file = null; // The full path to the file, e.g., /directory/file.extension; same as path
	fileWithoutExtension = null; // The full path the file without the extension
	nameWithoutExtension = null;
	extension = null;
	descriptor = null;

	constructor(path) {
		super(...arguments);
        
        this.initializeFile();
	}

    initializeFile() {
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
    }

	getContentType(file) {
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
	}

    async create(data, options) {
        var create = null;

        var fileExists = await this.exists();

        if(fileExists) {
            create = true;
        }
        else {
            create = await File.create(this.file, '', options);
        }

        return create;
    }

	async open(flags) {
		//app.log('Running file.open on', this.file, 'with flags', flags);
		this.descriptor = await File.open(this.file, flags);

		return this.descriptor;
	}

    async read(options) {
        var content = await File.read(this.path, options);
        //app.log('content', content);

        return content;
    }

    async readToBuffer(length, position) {
        //app.log('length', length, 'position', position);
        
        // If there is no file descriptor, open the file in read only mode
        if(!this.descriptor) {
            await this.open('r');
            //app.log('Opened file in read mode', this.descriptor);
        }

        return new Promise(function(resolve, reject) {
            var bufferToUse = new Buffer(length);

            Node.FileSystem.read(this.descriptor, bufferToUse, 0, length, position, function(error, bytesRead, buffer) {
                if(error) {
                    reject(error);
                }
                else {
                    //app.log('bytesRead', bytesRead);
                    resolve(buffer);
                }
            });
        }.bind(this));
    }

	async write(data) {
		//app.log('Running file.write', 'with descriptor', this.descriptor, data);
		var response = await File.write(this.descriptor, data);

        return response;
	}

    async toReadStream(options) {
        if(!this.readStream) {
            this.readStream = await File.createReadStream(this.path, options);
        }

        return this.readStream;
    }

    async toWriteStream(options) {
        var writeStream = await File.createWriteStream(this.path, options);

        return writeStream;
    }

    static is(value) {
        return value instanceof File;
    }

    static getContentType = File.prototype.getContentType;

    static read(path, options) {
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
    }

    static async readAndDecodeJson(path, options) {
        // Get the file content
        var fileContent = await File.read(path, options);

        return Json.decode(fileContent);
    }

    static open(path, flags, mode) {
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

    static write(fileDescriptor, buffer, offset, length, position) {
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

    static create(file, data, options) {
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

    static createReadStream() {
        var storedContext = this;
        var storedArguments = arguments;

        return new Promise(function(resolve, reject) {
            var readStream = Node.FileSystem.createReadStream.apply(storedContext, storedArguments);
            readStream.on('open', function(fileDescriptor) {
                resolve(readStream);
            });
            readStream.on('error', function(error) {
                app.error(error);
                reject(error);
            });
        });
    }

    static createWriteStream() {
        var storedContext = this;
        var storedArguments = arguments;

        return new Promise(function(resolve, reject) {
            var writeStream = Node.FileSystem.createWriteStream.apply(storedContext, storedArguments);
            writeStream.on('open', function(fileDescriptor) {
                resolve(writeStream);
            });
            writeStream.on('error', function(error) {
                app.error(error);
                reject(error);
            });
        });
    }

}

// Export
export default File;

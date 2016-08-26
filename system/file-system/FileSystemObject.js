// Class
class FileSystemObject {

	name = null; // The name of the file (with extension) or directory
	path = null; // The full path to the file or directory, e.g., /directory/file.extension
	directory = null; // The directory containing the file system object
	size = null; // The size of the file system object in bytes
	mode = null;
	userId = null;
	groupId = null;
	blocks = null;
	blockSize = null;
	deviceId = null;
	specialDeviceId = null;
	indexNode = null;
	hardLinks = null;
	timeAccessed = null;
	timeModified = null;
	timeStatusChanged = null;
	timeCreated = null;
	nodeStatus = null;

	statusInitialized = false;

	readStream = null;
	
	constructor(path) {
		this.path = Node.Path.normalize(path);

		// Make sure we have a path
		if(this.path) {
			// Figure out the name
			var name = this.path;
			if(this.path.endsWith(Node.Path.separator)) {
				name = name.replaceLast(Node.Path.separator, '');
			}
			this.name = name.substr(name.lastIndexOf(Node.Path.separator) + 1, name.length);

			// Figure out the directory
			this.directory = this.path.substr(0, this.path.lastIndexOf(Node.Path.separator) + 1);
		}
	}

	async initializeStatus() {
		if(await FileSystemObject.exists(this.path)) {
			// Get the file object status
			this.nodeStatus = await FileSystemObject.stat(this.path);

			// Set the class variables
			this.size = this.nodeStatus.size;
			this.mode = this.nodeStatus.mode;
			this.userId = this.nodeStatus.uid;
			this.groupId = this.nodeStatus.gid;
			this.blocks = this.nodeStatus.blocks;
			this.blockSize = this.nodeStatus.blksize;
			this.deviceId = this.nodeStatus.dev;
			this.specialDeviceId = this.nodeStatus.rdev;
			this.indexNode = this.nodeStatus.ino;
			this.hardLinks = this.nodeStatus.nlink;
			this.timeAccessed = new Time(this.nodeStatus.atime);
			this.timeModified = new Time(this.nodeStatus.mtime);
			this.timeStatusChanged = new Time(this.nodeStatus.ctime);
			this.timeCreated = new Time(this.nodeStatus.birthtime);

			this.statusInitialized = true;
		}
		else {
			Console.error('Could not initialize status, file system object at path '+this.path+', does not exist.');
		}
	}

	sizeInBits() {
		return this.size * 8;
	}

	sizeInBytes() {
		return this.size;
	}

	sizeInKilobytes() {
		return this.size / 1000;
	}

	sizeInKibibytes() {
		return this.size / 1024;
	}

	sizeInMegabytes() {
		return this.sizeInKilobytes() / 1000;
	}

	sizeInMebibytes() {
		return this.sizeInKibibytes() / 1024;
	}

	sizeInGigabytes() {
		return this.sizeInMegabytes() / 1000;
	}

	sizeInGigibytes() {
		return this.sizeInMebibytes() / 1024;
	}

	sizeInTerabytes() {
		return this.sizeInTerabytes() / 1000;
	}

	sizeInTebibytes() {
		return this.sizeInGigibytes() / 1024;
	}

	isFile() {
		return this.nodeStatus.isFile();
	}

	isDirectory() {
		return this.nodeStatus.isDirectory();
	}

	isBlockDevice() {
		return this.nodeStatus.isBlockDevice();
	}

	isCharacterDevice() {
		return this.nodeStatus.isCharacterDevice();
	}

	isSymbolicLink() {
		return this.nodeStatus.isSymbolicLink();
	}

	isFifo() {
		return this.nodeStatus.isFifo();
	}

	isSocket() {
		return this.nodeStatus.isSocket();
	}

	async exists(path) {
		path = (path === undefined) ? this.path : Node.Path.normalize(path);
		//Console.log('path', path);

	    var exists = await new Promise(function(resolve, reject) {
	    	Node.FileSystem.exists(path, function(exists) {
	    		//Console.log(path, exists);
	    		resolve(exists);
	    	});
	    });

        return exists;
	}

	async watch(callback) {
        var watch = await FileSystemObject.watch(this.path, callback);
		
        return watch;
	}

    static is(value) {
        return value instanceof FileSystemObject;
    }

    static exists = FileSystemObject.prototype.exists;

    static async stat(path) {
        var stat = await new Promise(function(resolve, reject) {
            Node.FileSystem.stat(path, function(error, stats) {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(stats);
                }
            });
        });

        return stat;
    }

    static async listFileNames(path) {
        var fileNamesList = await new Promise(function(resolve, reject) {
            Node.FileSystem.readdir(path, function(error, files) {
                if(error) {
                    reject(error);
                }
                else {
                    resolve(files);
                }
            });
        });

        return fileNamesList;
    }

    static async list(path, recursive) {
        var list = await new Promise(async function(resolve, reject) {
            var list = [];
            var fileNames = await FileSystemObject.listFileNames(path);

            // Dependencies
            //import FileSystemObjectFactory from './FileSystemObjectFactory.js';
            //var FileSystemObjectFactory = await System.import('./FileSystemObjectFactory.js');
            var FileSystemObjectFactory = require('./FileSystemObjectFactory.js').default;
            var Directory = require('./Directory.js').default;

            // Make sure we have the full path
            await fileNames.each(async function(index, fileName) {
                var fileSystemObject = await FileSystemObjectFactory.create(path+fileName);

                // Handle recursion
                if(recursive && Directory.is(fileSystemObject)) {
                    // Get the directory listing of any directories
                    var directoryList = await fileSystemObject.list(true);

                    // Add them to the list to return
                    directoryList.each(function(index, directoryListItem) {
                        list.push(directoryListItem);
                    });
                }

                if(fileSystemObject) {
                    list.push(fileSystemObject);
                }
                else {
                    //Console.log('No fileSystemObject for', path+fileName);
                }                
            });

            return list;
        });

        return list;
    }

    static async watch(paths, callback) {
        // Allow strings to be passed and convert it to an array
        if(String.is(paths)) {
            paths = [paths];
        }

        var fileSystemObjectsToWatch = [];

        // Loop through the paths and collect all of the file system objects to watch
        await paths.each(async function(pathIndex, path) {
            //Console.log('path', path);

            // Instantiate a file or directory from the path
            var fileSystemObject = await FileSystemObjectFactory.create(path);

            // Create an array to store file system objects to watch
            fileSystemObjectsToWatch.append(fileSystemObject);

            // If the path is a directory, get all of the files and folders in the directory and watch them as well
            if(fileSystemObject.isDirectory()) {
                var childFileSystemObjects = await fileSystemObject.list(true);

                childFileSystemObjects.each(function(childFileSystemObjectIndex, childFileSystemObject) {
                    fileSystemObjectsToWatch.append(childFileSystemObject);
                });
            }
        });

        // Make sure our file system object array is unique
        var uniqueFileSystemObjectsToWatch = [];
        fileSystemObjectsToWatch.each(function(fileSystemObjectToWatchIndex, fileSystemObjectToWatch) {
            // Check to see if we are already watching
            var alreadyWatchingFileSystemObject = false;
            uniqueFileSystemObjectsToWatch.each(function(uniqueFileSystemObjectIndex, uniqueFileSystemObject) {
                if(fileSystemObjectToWatch.path == uniqueFileSystemObject.path) {
                    alreadyWatchingFileSystemObject = true;
                    return false; // break
                }
            });

            if(!alreadyWatchingFileSystemObject) {
                uniqueFileSystemObjectsToWatch.append(fileSystemObjectToWatch);
            }
        });
        fileSystemObjectsToWatch = uniqueFileSystemObjectsToWatch;

        // Watch each file system object
        fileSystemObjectsToWatch.each(function(fileSystemObjectToWatchIndex, fileSystemObjectToWatch) {
            Node.FileSystem.watchFile(
                fileSystemObjectToWatch.path,
                {
                    persistent: true,
                    interval: 1000,
                },
                function(currentNodeStatus, previousNodeStatus) {
                    var currentStatus = {};
                    var previousStatus = {};

                    // Set the current status variables
                    currentStatus.size = currentNodeStatus.size;
                    currentStatus.mode = currentNodeStatus.mode;
                    currentStatus.userId = currentNodeStatus.uid;
                    currentStatus.groupId = currentNodeStatus.gid;
                    currentStatus.blocks = currentNodeStatus.blocks;
                    currentStatus.blockSize = currentNodeStatus.blksize;
                    currentStatus.deviceId = currentNodeStatus.dev;
                    currentStatus.specialDeviceId = currentNodeStatus.rdev;
                    currentStatus.indexNode = currentNodeStatus.ino;
                    currentStatus.hardLinks = currentNodeStatus.nlink;
                    currentStatus.timeAccessed = new Time(currentNodeStatus.atime);
                    currentStatus.timeModified = new Time(currentNodeStatus.mtime);
                    currentStatus.timeStatusChanged = new Time(currentNodeStatus.ctime);

                    // Set the current status variables
                    previousStatus.size = previousNodeStatus.size;
                    previousStatus.mode = previousNodeStatus.mode;
                    previousStatus.userId = previousNodeStatus.uid;
                    previousStatus.groupId = previousNodeStatus.gid;
                    previousStatus.blocks = previousNodeStatus.blocks;
                    previousStatus.blockSize = previousNodeStatus.blksize;
                    previousStatus.deviceId = previousNodeStatus.dev;
                    previousStatus.specialDeviceId = previousNodeStatus.rdev;
                    previousStatus.indexNode = previousNodeStatus.ino;
                    previousStatus.hardLinks = previousNodeStatus.nlink;
                    previousStatus.timeAccessed = new Time(previousNodeStatus.atime);
                    previousStatus.timeModified = new Time(previousNodeStatus.mtime);
                    previousStatus.timeStatusChanged = new Time(previousNodeStatus.ctime);

                    return callback(fileSystemObjectToWatch, currentStatus, previousStatus);
                }
            );
        });
        //Console.log('Watching', fileSystemObjectsToWatch.length, 'file system objects.');
            
        return fileSystemObjectsToWatch;
    }
	
}

// Export
export default FileSystemObject;

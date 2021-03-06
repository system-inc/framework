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
        this.initializeFileSystemObject(path);
	}

    initializeFileSystemObject(path) {
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
			app.error('Could not initialize status, file system object at path '+this.path+', does not exist.');
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
        if(!path && this) {
            path = this.path;
        }
        else if(path) {
            path = Node.Path.normalize(path);
        }

		//console.log('FileSystemObject.exists, path', path);

        var exists = null;

        try {
            var stat = await FileSystemObject.stat(path);
            //console.log(stat);
            exists = true;
        }
        catch(error) {
            //console.log('error', error);
            exists = false;
        }

        //console.log('exists', exists);
        
        return exists;
	}

	async watch(callback) {
        var watch = await FileSystemObject.watch(this.path, callback);
		
        return watch;
    }

    toString() {
        return this.path;
    }

    static is(value) {
        return value instanceof FileSystemObject;
    }

    static exists = FileSystemObject.prototype.exists;

    static async stat(path) {
        var stat = await new Promise(function(resolve, reject) {
            Node.FileSystem.stat(path.toString(), function(error, stats) {
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

    static async listFileNames(directoryObjectOrPathString, filteringFunction) {
        var directory = directoryObjectOrPathString;

        if(String.is(directoryObjectOrPathString)) {
            const { Directory } = await import('@framework/system/file-system/Directory.js');
            directory = new Directory(path);
        }
        
        var fileNamesList = await new Promise(function(resolve, reject) {
            Node.FileSystem.readdir(directory.toString(), function(error, fileNames) {
                if(error) {
                    reject(error);
                }
                else {
                    if(filteringFunction) {
                        fileNames = fileNames.filter(filteringFunction);
                    }

                    resolve(fileNames);
                }
            });
        });

        return fileNamesList;
    }

    static async list(path, recursive, filteringFunction) {
        //app.log('FileSystemObject.list', ...arguments);

        // Dependencies
        const { Directory } = await import('@framework/system/file-system/Directory.js');

        var directory = new Directory(path);

        var list = [];
        var fileNames = await FileSystemObject.listFileNames(directory, filteringFunction);
        //app.exit('fileNames', fileNames);

        // Make sure we have the full path
        await fileNames.each(async function(index, fileName) {
            var fileSystemObject = null;

            //app.log('fileName', directory+fileName);
            try {
                var fileSystemObject = await FileSystemObject.createFromPath(directory+fileName);
            }
            catch(error) {
                // Do nothing, this is most likely a permissions issue
            }
            
            //app.log('fileSystemObject', fileSystemObject);

            // Handle recursion
            if(recursive && Directory.is(fileSystemObject)) {
                // Get the directory listing of any directories
                var directoryList = await fileSystemObject.list(true, filteringFunction);

                // Add them to the list to return
                directoryList.each(function(index, directoryListItem) {
                    list.append(directoryListItem);
                });
            }

            if(fileSystemObject) {
                list.append(fileSystemObject);
            }
            else {
                app.log('No fileSystemObject for', directory+fileName);
            }
        });

        //app.exit('list', list);

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
            //app.log('path', path);

            // Instantiate a file or directory from the path
            var fileSystemObject = await FileSystemObject.createFromPath(path);

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
        //app.log('Watching', fileSystemObjectsToWatch.length, 'file system objects.');
            
        return fileSystemObjectsToWatch;
    }

    static async createFromPath(path) {
        //app.log('FileSystemObject.createFromPath', ...arguments);

        // Make sure we have a path
        if(!path) {
            throw new Error('No path provided at FileSystemObject.createFromPath(path).');
        }

        var fileSystemObject = null;

        // Get the file object status
        //app.log('calling FileSystemObject.stat');
        var nodeStatus = await FileSystemObject.stat(path);
        //app.log('nodeStatus', nodeStatus);

        // Make sure to always be an instance of File or Directory
        if(nodeStatus.isFile()) {
            const { File } = await import('@framework/system/file-system/File.js');
            fileSystemObject = new File(path);
            await fileSystemObject.initializeStatus();
        }
        else if(nodeStatus.isDirectory()) {
            const { Directory } = await import('@framework/system/file-system/Directory.js');
            fileSystemObject = new Directory(path);
            await fileSystemObject.initializeStatus();
        }

        return fileSystemObject;
    }
	
}

// Export
export { FileSystemObject };

FileSystem = {};

// Static methods
FileSystem.stat = function(path) {
    return new Promise(function(resolve, reject) {
    	Node.FileSystem.stat(path, function(error, stats) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(stats);
    		}
    	});
    });
}

FileSystem.listFileNames = function(path) {
    return new Promise(function(resolve, reject) {
        Node.FileSystem.readdir(path, function(error, files) {
            if(error) {
                reject(error);
            }
            else {
                resolve(files);
            }
        });
    });
}

FileSystem.list = function(path, recursive) {
    return new Promise(function(resolve, reject) {
        Generator.run(function*() {
            var list = [];
            var fileNames = yield FileSystem.listFileNames(path);

            // Make sure we have the full path
            yield fileNames.each(function*(index, fileName) {
                var fileSystemObject = yield FileSystemObject.constructFromPath(path+fileName);

                // Handle recursion
                if(recursive && Class.isInstance(fileSystemObject, Directory)) {
                    // Get the directory listing of any directories
                    var directoryList = yield fileSystemObject.list(true);

                    // Add them to the list to return
                    directoryList.each(function(index, directoryListItem) {
                        list.push(directoryListItem);
                    });
                }

                list.push(fileSystemObject);
            });

            return list;
        }, resolve);
    });
}

FileSystem.watch = function(paths, callback) {
    return new Promise(function(resolve, reject) {
        Generator.run(function*() {
            // Allow strings to be passed and convert it to an array
            if(String.is(paths)) {
                paths = [paths];
            }

            var fileSystemObjectsToWatch = [];

            // Loop through the paths and collect all of the file system objects to watch
            yield paths.each(function*(pathIndex, path) {
                //Console.out('path', path);

                // Instantiate a file or directory from the path
                var fileSystemObject = yield FileSystemObject.constructFromPath(path);

                // Create an array to store file system objects to watch
                fileSystemObjectsToWatch.append(fileSystemObject);

                // If the path is a directory, get all of the files and folders in the directory and watch them as well
                if(fileSystemObject.isDirectory()) {
                    var childFileSystemObjects = yield fileSystemObject.list(true);

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
            //Console.out('Watching', fileSystemObjectsToWatch.length, 'file system objects.');
            
            return fileSystemObjectsToWatch;
        }, resolve);
    });    
}
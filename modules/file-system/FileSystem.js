FileSystem = {};

// Static methods
FileSystem.stat = Promise.method(function(path) {
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
});

FileSystem.listFileNames = Promise.method(function(path) {
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
});

FileSystem.list = Promise.method(function(path, recursive) {
    return new Promise(function(resolve, reject) {
        Generator.run(function*() {
            var list = [];
            var fileNames = yield FileSystem.listFileNames(path);

            // Make sure we have the full path
            yield fileNames.each(function*(index, fileName) {
                var fileSystemObject = yield FileSystemObject.constructFromPath(path+fileName);

                // Handle recursion
                if(recursive && fileSystemObject.is(Directory)) {
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
});
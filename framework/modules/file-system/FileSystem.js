FileSystem = function() {
}

// Static methods
FileSystem.stat = Promise.method(function(path) {
    return new Promise(function(resolve, reject) {
    	NodeFileSystem.stat(path, function(error, stats) {
    		if(error) {
    			reject(error);
    		}
    		else {
    			resolve(stats);
    		}
    	});
    });
});
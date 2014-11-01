FileSystem = function() {
}

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
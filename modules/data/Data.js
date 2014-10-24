Data = Class.extend({
});

// Static methods
Data.decode = Promise.method(function(data, encoding) {
    return new Promise(function(resolve, reject) {
    	// Gzip
		if(encoding == 'gzip') {
			NodeZlib.gunzip(data, function(error, result) {
				if(error) {
					reject(error);
				}
				else {
					resolve(result.toString());
				}
			});
		}
		else {
			reject(encoding+' is an unsupported encoding type.');
		}
    });
});

Data.encode = Promise.method(function(data, encoding) {
    return new Promise(function(resolve, reject) {
    	// Gzip
		if(encoding == 'gzip' || encoding == 'deflate') {
			NodeZlib[encoding](data, function(error, result) {
				if(error) {
					reject(error);
				}
				else {
					resolve(result);
				}
			});
		}
		else {
			reject(encoding+' is an unsupported encoding type.');
		}
    });
});
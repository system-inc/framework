Data = Class.extend({
});

// Static methods
Data.decode = Promise.method(function(data, encodingType) {
    return new Promise(function(resolve, reject) {
    	// Gzip
		if(encodingType == 'gzip') {
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
			reject('Unsupported encoding type.');
		}
    });
});
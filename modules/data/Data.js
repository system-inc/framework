Data = Class.extend({
});

// Static methods
Data.decode = function(data, encoding) {
    return new Promise(function(resolve, reject) {
    	// Gzip
		if(encoding == 'gzip') {
			Node.Zlip.gunzip(data, function(error, result) {
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
}

Data.encode = function(data, encoding) {
    return new Promise(function(resolve, reject) {
    	// Gzip
		if(encoding == 'gzip' || encoding == 'deflate') {
			Node.Zlip[encoding](data, function(error, result) {
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
}
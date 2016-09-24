// Class
class Data {

	static decode(data, encoding) {
	    return new Promise(function(resolve, reject) {
	    	// Gzip
			if(encoding == 'gzip') {
				Node.Zlib.gunzip(data, function(error, result) {
					if(error) {
						reject(error);
					}
					else {
						resolve(result.toString());
					}
				});
			}
			else if(encoding == 'deflate') {
				Node.Zlib.inflate(data, function(error, result) {
					if(error) {
						reject(error);
					}
					else {
						resolve(result.toString());
					}
				});
			}
			else {
				reject(new Error(encoding+' is an unsupported encoding type.'));
			}
	    });
	}

	static encode(data, encoding) {
	    return new Promise(function(resolve, reject) {
	    	// Gzip or deflate
			if(encoding == 'gzip' || encoding == 'deflate') {
				Node.Zlib[encoding](data, function(error, result) {
					if(error) {
						reject(error);
					}
					else {
						resolve(result);
					}
				});
			}
			else {
				reject(new Error(encoding+' is an unsupported encoding type.'));
			}
	    });
	}

}

// Export
export default Data;

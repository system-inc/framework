// Class
class Data {

	static decode(data, encoding) {
		//app.info('Data.decode');

		if(!data || Buffer.is(data) && data.byteLength == 0) {
			//app.info('No data to decode, returning data.');
			return data;
		}

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
		//app.info('Data.encode');

		if(!data || Buffer.is(data) && data.byteLength == 0) {
			//app.info('No data to encode, returning data.');
			return data;
		}

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
export { Data };

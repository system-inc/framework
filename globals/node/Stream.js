// Class
class Stream extends Node.Stream.Stream {

	toString(encoding) {
		return new Promise(function(resolve, reject) {
			if(encoding) {
				this.setEncoding(encoding);
			}

			var string = '';

			this.on('data', function(chunk) {
				//app.log('chunk size in bytes', chunk.toString().sizeInBytes());
				string += chunk;
			});

			this.on('end', function() {
				resolve(string);
			});
		}.bind(this));
	}

	static is(value) {
		return value instanceof Stream;
	}

}

// Global
global.Stream = Stream;

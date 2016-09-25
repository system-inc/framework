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
		var is = false;

		if(value instanceof Stream) {
			is = true;
		}
		else if(value instanceof Node.Stream.Stream) {
			is = true;
		}

		return is;
	}

}

// Patch Node's Stream with a nice toString method
Node.Stream.Stream.prototype.toString = Stream.prototype.toString;

// Global
global.Stream = Stream;

// Class
var Stream = Node.Stream.Stream;

// Static methods

Stream.is = function(value) {
	return value instanceof Stream;
};

Stream.prototype.toString = function(encoding) {
	return new Promise(function(resolve, reject) {
		if(encoding) {
			this.setEncoding(encoding);
		}

		var string = '';

		this.on('data', function(chunk) {
			//Console.log('chunk size in bytes', chunk.toString().sizeInBytes());
			string += chunk;
		});

		this.on('end', function() {
			resolve(string);
		});
	}.bind(this));
};

// Export
module.exports = Stream;
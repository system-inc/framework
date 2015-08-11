Stream = Node.Stream.Stream;

Stream.is = function(value) {
	return value instanceof Stream;
}

Stream.prototype.toString = function(encoding) {
	return new Promise(function(resolve, reject) {
		if(encoding) {
			this.setEncoding(encoding);
		}

		var string = '';

		this.on('data', function(chunk) {
			//console.log('chunk size in bytes', chunk.toString().sizeInBytes());
			string += chunk;
		});

		this.on('end', function() {
			resolve(string);
		});
	}.bind(this));
}
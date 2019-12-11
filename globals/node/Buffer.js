// Class
var Buffer = Node.Buffer;

// Static methods
Buffer.is = function(value) {
	var is = false;

	if(value instanceof Buffer) {
		is = true;
	}
	else if(value instanceof Node.Buffer) {
		is = true;
	}

	return is;
};

Buffer.cast = function(data) {
	var buffer = null;

	// If the data is already a buffer, just return it
	if(Buffer.isBuffer(data)) {
		buffer = data;
	}
	// If the data is a number
	else if(Number.is(data)) {
		buffer = Buffer.alloc(data);
	}
	// If the data is a string
	else if(String.is(data)) {
		buffer = Buffer.from(data);
	}
	else {
		throw new Error('Data must be buffer, number, or string, received '+(typeof data));
	}

	return buffer;
}

// Global
global.Buffer = Buffer;

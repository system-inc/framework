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

// Global
global.Buffer = Buffer;

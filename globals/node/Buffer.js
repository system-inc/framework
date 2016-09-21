// Class
class Buffer extends Node.Buffer {

	static is(value) {
		var is = false;

		if(value instanceof Buffer) {
			is = true;
		}
		else if(value instanceof Node.Buffer) {
			is = true;
		}

		return is;
	}

	static concatenate = Node.Buffer.concat;

}

// Global
global.Buffer = Buffer;

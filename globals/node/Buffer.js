// Class
class Buffer extends Node.Buffer {

	static is(value) {
		return value instanceof Buffer;
	}

	static concatenate = Node.Buffer.concat;

}

// Global
global.Buffer = Buffer;

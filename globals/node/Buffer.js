// Class
class Buffer extends Node.Buffer {

	static concatenate = Node.Buffer.concat;

	static is(value) {
		return value instanceof Stream;
	}

}

// Global
global.Buffer = Buffer;

// Export
export default Buffer;
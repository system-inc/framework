export default Buffer extends Buffer {

	static is(value) {
		return value instanceof Buffer;	
	}

}

Buffer.is = function(value) {
	
};

Buffer.concatenate = Buffer.concat;

// Export
module.exports = Buffer;
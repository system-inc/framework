// Static methods

Buffer.is = function(value) {
	return value instanceof Buffer;
};

Buffer.concatenate = Buffer.concat;

// Export
module.exports = Buffer;
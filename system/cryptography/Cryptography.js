// Class
class Cryptography {

	static random() {
		return new Promise(function(resolve) {
			Node.Cryptography.randomBytes(16, function(ex, buffer) {
				var hex = buffer.toString('hex');
				var integer = parseInt(hex, 16);
				var random = integer / (0xffffffffffffffffffffffffffffffff);

				resolve(random);
			});
		});
	}

	static hash(algorithm, string, encoding) {
		return Node.Cryptography
	        .createHash(algorithm || 'md5')
	        .update(string, 'utf8')
	        .digest(encoding || 'hex');
	}

}

// Export
export default Cryptography;

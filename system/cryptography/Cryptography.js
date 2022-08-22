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

	static hash(string, algorithm = 'sha256', encoding = 'hex') {
		return Node.Cryptography
	        .createHash(algorithm)
	        .update(string, 'utf8')
	        .digest(encoding);
	}

}

// Export
export { Cryptography };

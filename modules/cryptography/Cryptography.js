Cryptography = function() {
}

Cryptography.random = function() {
	return new Promise(function(resolve) {
		Node.Crypto.randomBytes(16, function(ex, buffer) {
			var hex = buffer.toString('hex');
			var integer = parseInt(hex, 16);
			var random = integer / (0xffffffffffffffffffffffffffffffff);

			resolve(random);
		});
	});
}
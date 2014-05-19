Cryptography = function() {
}

Cryptography.random = Promise.method(function() {
	return new Promise(function(resolve) {
		NodeCrypto.randomBytes(4, function(ex, buffer) {
			var hex = buffer.toString('hex');
			var integer = parseInt(hex, 16);
			var random = integer / (0xffffffffffffffff+1);

			resolve(random);
			return random;
		});
	});
});
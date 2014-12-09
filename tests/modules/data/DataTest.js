DataTest = Test.extend({

	testGzipEncodeDecode: function*() {
		var actual = 'Encode and decode me.';

		actual = yield Data.encode(actual, 'gzip');
		//Console.out(actual.toString());
		actual = yield Data.decode(actual, 'gzip');
		//Console.out(actual);

		var expected = 'Encode and decode me.';

		Assert.equal(actual, expected, 'gzip encode and decode a string');
	},

});
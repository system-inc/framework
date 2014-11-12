CryptographyTest = Test.extend({

	testRandom: function*() {
		var actual = yield Cryptography.random();
		Assert.greaterThanOrEqualTo(actual, 0, 'between 0 (inclusive)');
		Assert.lessThan(actual, 1, 'and 1 (exclusive)');
	},

});
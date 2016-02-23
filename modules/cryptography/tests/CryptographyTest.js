// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');
var Cryptography = Framework.require('modules/cryptography/Cryptography.js');

// Class
var CryptographyTest = Test.extend({

	testRandom: function*() {
		var actual = yield Cryptography.random();
		Assert.greaterThanOrEqualTo(actual, 0, 'between 0 (inclusive)');
		Assert.lessThan(actual, 1, 'and 1 (exclusive)');
	},

});

// Export
module.exports = CryptographyTest;
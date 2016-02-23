// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');
var Data = Framework.require('modules/data/Data.js');

// Class
var DataTest = Test.extend({

	testGzipEncodeDecode: function*() {
		var actual = 'Encode and decode me.';

		actual = yield Data.encode(actual, 'gzip');
		//Console.log(actual.toString());
		actual = yield Data.decode(actual, 'gzip');
		//Console.log(actual);

		var expected = 'Encode and decode me.';

		Assert.equal(actual, expected, 'gzip encode and decode a string');
	},

});

// Export
module.exports = DataTest;
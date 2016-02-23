// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');

// Class
var ErrorTest = Test.extend({

	testError: function() {
		var error = new Error();

		Assert.true(error.hasKey('code'), 'has code');
		Assert.true(error.hasKey('identifier'), 'has identifier');
		Assert.true(error.hasKey('message'), 'has message');
		Assert.true(error.hasKey('location'), 'has location');
		Assert.true(error.hasKey('data'), 'has data');
		Assert.true(error.hasKey('url'), 'has url');
		Assert.true(error.hasKey('stackTrace'), 'has stackTrace');
		Assert.true(error.hasKey('callSite'), 'has callSite');
	},

});

// Export
module.exports = ErrorTest;
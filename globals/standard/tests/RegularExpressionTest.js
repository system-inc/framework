// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var RegularExpressionTest = Test.extend({

	testIs: function() {
		Assert.true(RegularExpression.is(new RegExp('test')), 'accepts RegExp');
		Assert.true(RegularExpression.is(new RegularExpression('test')), 'accepts RegularExpression');
	},

});

// Export
module.exports = RegularExpressionTest;
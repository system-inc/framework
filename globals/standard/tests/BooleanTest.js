// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var BooleanTest = Test.extend({

	testIs: function() {
		Assert.true(Boolean.is(false), 'false');
		Assert.true(Boolean.is(true), 'true');
		
		Assert.false(Boolean.is(), 'nothing');
		Assert.false(Boolean.is(undefined), 'undefined');
		Assert.false(Boolean.is(0), '0');
	},

});

// Export
module.exports = BooleanTest;
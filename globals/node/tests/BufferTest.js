// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var BufferTest = Test.extend({

	testIs: function() {
		Assert.true(Buffer.is(new Buffer('Buffer')), 'buffer object');
		Assert.false(Buffer.is(''), 'empty string');
		Assert.false(Buffer.is('string'), 'string');
	},

});

// Export
module.exports = BufferTest;
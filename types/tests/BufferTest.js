BufferTest = Test.extend({

	testIs: function() {
		Assert.true(Buffer.is(new Buffer('Buffer')), 'buffer object');
		Assert.false(Buffer.is(''), 'empty string');
		Assert.false(Buffer.is('string'), 'string');
	},

});
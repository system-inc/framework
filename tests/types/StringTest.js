StringTest = Test.extend({

	testContains: function*() {
		Assert.true('aabbccaabbcc'.contains('a'));
		Assert.false('aabbccaabbcc'.contains('A', true));
		Assert.false('aabbccaabbcc'.contains('x'));

		Assert.equal('aabbccaabbcc'.contains('a'), 4);
		Assert.equal('aabbccaabbcc'.contains('aa'), 2);
		Assert.equal('aabbccaabbcc'.contains('A', true), 0);
	},

	testGenerator: function*() {
		Assert.true(true);
		Assert.true(false);	
	},

});
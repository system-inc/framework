RegularExpressionTest = Test.extend({

	testIs: function() {
		Assert.true(RegularExpression.is(new RegExp('test')), 'Accepts RegExp');
		Assert.true(RegularExpression.is(new RegularExpression('test')), 'Accepts RegularExpression');
	},

});
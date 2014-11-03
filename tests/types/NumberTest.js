NumberTest = Test.extend({

	testIs: function*() {
		Assert.true(Number.is(1));
		Assert.false(Number.is('1'));
	},

});
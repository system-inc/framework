ArrayTest = Test.extend({

	is: function() {
		Assert.true(Array.is([]));
		Assert.false(Array.is('[]'));
	},

});
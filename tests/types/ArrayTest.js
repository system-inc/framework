ArrayTest = Test.extend({

	is: function() {
		Assert.true(Array.is([]));
		Assert.false(Array.is('[]'));
		Assert.true(Array.is('string'.toArray()));
	},

	merge: function() {
		Assert.equal(Json.encode([1,2,3]), Json.encode([1].merge([2,3])));
	},

});
ArrayTest = Test.extend({

	testIs: function*() {
		Assert.true(Array.is([]));
		Assert.false(Array.is('[]'));
		Assert.true(Array.is('string'.toArray()));
		yield Function.delay(1);
	},

	testMerge: function*() {
		Assert.equal(Json.encode([1,2,3]), Json.encode([1].merge([2,3])));
		yield Function.delay(1);
	},

	testFirst: function*() {
		yield Function.delay(1);
	},

	testLast: function*() {
		yield Function.delay(1);
	},

});
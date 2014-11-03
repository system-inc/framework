ArrayTest = Test.extend({

	testContains: function() {
		var array = [
			'aa',
			'bb',
			'cc',
			'aa',
			'bb',
			'cc',
		];

		Console.out(array.contains('a'));
	},

	testIs: function*() {
		Assert.true(Array.is([]));
		Assert.false(Array.is('[]'));
		Assert.true(Array.is('string'.toArray()));
		yield Function.delay(1);
	},

	testMerge: function*() {
		Assert.equal(Json.encode([1,2,3]), Json.encode([1].merge([2,3])));
		yield Function.delay(50);
	},

	testFirst: function*() {
		yield Function.delay(10);
	},

	testLast: function*() {
		yield Function.delay(1);
	},

});
ArrayTest = Test.extend({

	testContains: function() {
		var array = [
			'aa',
			'bb',
			'cc',
			'dd',
			'aa',
			'bb',
			'cc',
		];

		Assert.equal(array.contains('aa'), 2);
		Assert.equal(array.contains('AA'), 2);
		Assert.equal(array.contains('AA', true), 0);
		Assert.false(array.contains('AA', true));
		Assert.true(array.contains('AA', true));
	},

	testIs: function() {
		Assert.true(Array.is([]));
		Assert.false(Array.is('[]'));
		Assert.true(Array.is('string'.toArray()));
	},

	testMerge: function() {
		Assert.equal(Json.encode([1,2,3]), Json.encode([1].merge([2,3])));
	},

	testFirst: function() {
	},

	testLast: function() {
	},

});
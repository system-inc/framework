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

		Assert.equal(array.contains('aa'), 2, 'Returns integer');
		Assert.equal(array.contains('AA'), 2, 'Case insensitive by default');
		Assert.equal(array.contains('AA', true), 0, 'Case sensitivity');
		Assert.false(array.contains('AA', true), 'No matches is falsey');
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
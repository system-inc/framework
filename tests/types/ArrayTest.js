ArrayTest = Test.extend({

	testIs: function() {
		Assert.true(Array.is([]), 'An array literal ([]) is an array');
		Assert.false(Array.is('[]'), 'A JSON array "[]" is not an array');
		Assert.false(Array.is({}), 'An object literal ({}) is not an array');
	},

	testMerge: function() {
		Assert.deepEqual([1,2,3], [1].merge([2,3]), 'An array of primitives');
		Assert.deepEqual([], [].merge([]), 'Two empty arrays');

		var a = [
			{
				'firstKey': 'firstValue',
			},
			{
				'secondKey': 'secondValue',
			},
		];
		var b = [
			{
				'firstKey': 'firstValue',
			},
			{
				'secondKey': 'secondValue',
			},
			{
				'thirdKey': 'thirdValue',
			},
		];
		var actual = a.merge(b);
		var expected = [
			{
				'firstKey': 'firstValue',
			},
			{
				'secondKey': 'secondValue',
			},
			{
				'firstKey': 'firstValue',
			},
			{
				'secondKey': 'secondValue',
			},
			{
				'thirdKey': 'thirdValue',
			},
		];
		Assert.deepEqual(actual, expected, 'An array of objects');
	},

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

	testCount: function() {
		var array = [
			'aa',
			'bb',
			'cc',
			'dd',
			'aa',
			'bb',
			'cc',
		];

		Assert.equal(array.count('aa'), 2, 'Returns integer');
		Assert.equal(array.count('AA'), 2, 'Case insensitive by default');
		Assert.equal(array.count('AA', true), 0, 'Case sensitivity');
		Assert.false(array.count('AA', true), 'No matches is falsey');
	},

	testFirst: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		Assert.equal(array.first(), 'a', 'Returns element at index 0');

		Assert.strictEqual([].first(), null, 'Empty array returns null');
	},

	testLast: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		Assert.equal(array.last(), 'c', 'Returns element at last index');

		Assert.strictEqual([].last(), null, 'Empty array returns null');
	},

	testGet: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		Assert.equal(array.get(1), 'b', 'Returns element at specified index');
		Assert.strictEqual(array.get(10), null, 'Non-existent index returns null');
		Assert.strictEqual([].get(0), null, 'Empty array returns null');
	},

	testDelete: function() {
		var array = [
			'a',
			'b',
			'c',
		];
		var actual = array.delete(1);
		var expected = [
			'a',
			'c',
		];
		Assert.deepEqual(actual, expected, 'Delete at specified index');

		array = [
			'a',
			'b',
			'c',
		];
		actual = array.delete(10);
		expected = [
			'a',
			'b',
			'c',
		];
		Assert.deepEqual(actual, expected, 'Delete at non-existent index does nothing');
	},

	testEach: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		var string = '';
		array.each(function(index, element) {
			string += index+element;
		});

		Assert.equal(string, '0a1b2c', 'Index and element are passed in the correct order');
	},

	testEachWithGenerator: function*() {
		var array = [
			'a',
			'b',
			'c',
		];

		var string = '';
		yield array.each(function*(index, element) {
			string += index+element;
		});

		Assert.equal(string, '0a1b2c', 'Index and element are passed in the correct order');
	},

});
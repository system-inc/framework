ArrayTest = Test.extend({

	testIs: function() {
		Assert.true(Array.is([]), 'array literal ([]) is an array');
		Assert.false(Array.is('[]'), 'JSON array "[]" is not an array');
		Assert.false(Array.is({}), 'object literal ({}) is not an array');
	},

	testUnique: function() {
		var actual = [
			'apple',
			'banana',
			'banana',
			'cherry',
		].unique();
		//Console.out(actual);

		var expected = [
			'apple',
			'banana',
			'cherry',
		];

		Assert.deepEqual(actual, expected, 'Removes duplicate elements');
	},

	testSortObjectsByKeyValue: function() {
		var actual = [
			{
				'a': 10,
				'b': 'originally first, should be third',
			},
			{
				'a': 1,
				'b': 'originally second, should be first',
			},
			{
				'a': 5,
				'b': 'originally third, should be second',
			},
		].sortObjectsByKeyValue('a');
		//Console.out(actual);

		var expected = [
			{
				'a': 1,
				'b': 'originally second, should be first',
			},
			{
				'a': 5,
				'b': 'originally third, should be second',
			},
			{
				'a': 10,
				'b': 'originally first, should be third',
			},
		];

		Assert.deepEqual(actual, expected, 'Sorts objects by key value where the value is a number');

		actual = [
			{
				'a': 'c',
				'b': 'originally first, should be third',
			},
			{
				'a': 'a',
				'b': 'originally second, should be first',
			},
			{
				'a': 'b',
				'b': 'originally third, should be second',
			},
		].sortObjectsByKeyValue('a');
		//Console.out(actual);

		expected = [
			{
				'a': 'a',
				'b': 'originally second, should be first',
			},
			{
				'a': 'b',
				'b': 'originally third, should be second',
			},
			{
				'a': 'c',
				'b': 'originally first, should be third',
			},
		];

		Assert.deepEqual(actual, expected, 'Sorts objects by key value where the value is a string');
	},

	testMerge: function() {
		Assert.deepEqual([1,2,3], [1].merge([2,3]), 'array of primitives');
		Assert.deepEqual([], [].merge([]), 'two empty arrays');

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
		Assert.deepEqual(actual, expected, 'array of objects');
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

		Assert.equal(array.contains('aa'), 2, 'returns integer');
		Assert.equal(array.contains('AA'), 2, 'case insensitive by default');
		Assert.equal(array.contains('AA', true), 0, 'case sensitive');
		Assert.false(array.contains('AA', true), 'no matches is falsey');
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

		Assert.equal(array.count('aa'), 2, 'returns integer');
		Assert.equal(array.count('AA'), 2, 'case insensitive by default');
		Assert.equal(array.count('AA', true), 0, 'case sensitivity');
		Assert.false(array.count('AA', true), 'no matches is falsey');
	},

	testFirst: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		Assert.equal(array.first(), 'a', 'returns element at index 0');

		Assert.strictEqual([].first(), null, 'empty array returns null');
	},

	testLast: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		Assert.equal(array.last(), 'c', 'returns element at last index');

		Assert.strictEqual([].last(), null, 'empty array returns null');
	},

	testGet: function() {
		var array = [
			'a',
			'b',
			'c',
		];

		Assert.equal(array.get(1), 'b', 'returns element at specified index');
		Assert.strictEqual(array.get(10), null, 'non-existent index returns null');
		Assert.strictEqual([].get(0), null, 'empty array returns null');
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
		Assert.deepEqual(actual, expected, 'delete at specified index');

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
		Assert.deepEqual(actual, expected, 'delete at non-existent index does nothing');
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

		Assert.equal(string, '0a1b2c', 'index and element are passed in the correct order');
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

		Assert.equal(string, '0a1b2c', 'index and element are passed in the correct order');
	},

	testToObject: function() {
		var array = [
			'a',
			'b',
			'c',
		];
		object = Array.toObject(array);

		var actual = object.toJson();
		var expected = '{"0":"a","1":"b","2":"c"}';
		Assert.equal(actual, expected, 'turned into object');
	},

	testPrototypeToObject: function() {
		var array = [
			'a',
			'b',
			'c',
		].toObject();

		var actual = array.toJson();
		var expected = '{"0":"a","1":"b","2":"c"}';
		Assert.equal(actual, expected, 'turned into object');
	},

});
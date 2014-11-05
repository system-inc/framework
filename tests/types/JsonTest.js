JsonTest = Test.extend({

	testIs: function() {
		Assert.true(Json.is('{}'), 'An object literal string "{}"');
		Assert.true(Json.is('[]'), 'An array literal string "[]"');
		Assert.false(Json.is(''), 'An empty string');
		Assert.false(Json.is([]), 'An array literal []');
		Assert.false(Json.is({}), 'An object literal []');
		Assert.false(Json.is(10), 'A number');
		Assert.false(Json.is(true), 'A boolean');
	},

	testEncode: function() {
		Assert.strictEqual(Json.encode(), '', 'Passing nothing should return a blank string');
		Assert.strictEqual(Json.encode(null), '', 'Passing null should return a blank string');
		Assert.equal(Json.encode([]), '[]', 'An empty array');
		Assert.equal(Json.encode({}), '{}', 'An empty object');

		var actual = Json.encode([
			'a',
			'b',
			'c',
		]);
		var expected = '["a","b","c"]';
		Assert.equal(actual, expected, 'An array');

		actual = Json.encode({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		expected = '{"a":1,"b":2,"c":3}';
		Assert.equal(actual, expected, 'An object');

		actual = Json.encode({
			a: 1,
			fn: function() {
				var a = 'test';
			}
		});
		expected = '{"a":1}';
		Assert.equal(actual, expected, 'Functions are not encoded and keys pointing to functions are not visible');
	},

	testDecode: function() {
		Assert.strictEqual(Json.decode(), null, 'Passing nothing should return null');
		Assert.strictEqual(Json.decode(null), null, 'Passing null should return null');
		Assert.deepEqual(Json.decode('[]'), [], 'An empty array');
		Assert.deepEqual(Json.decode('{}'), {}, 'An empty object');

		var actual = Json.decode('["a","b","c"]');
		var expected = [
			'a',
			'b',
			'c',
		];
		Assert.deepEqual(actual, expected, 'An array');

		actual = Json.decode('{"a":1,"b":2,"c":3}');
		expected = {
			'a': 1,
			'b': 2,
			'c': 3,
		};
		Assert.deepEqual(actual, expected, 'An object');
	},

	testDecycle: function() {

	},

	testRetrocycle: function() {

	},

});
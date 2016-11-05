// Dependencies
import Test from 'system/test/Test.js';
import Assert from 'system/test/Assert.js';

// Class
class JsonTest extends Test {

	testIs() {
		Assert.true(Json.is('{}'), 'object literal string "{}"');
		Assert.true(Json.is('[]'), 'array literal string "[]"');
		Assert.false(Json.is(''), 'empty string');
		Assert.false(Json.is([]), 'array literal []');
		Assert.false(Json.is({}), 'object literal []');
		Assert.false(Json.is(10), 'number');
		Assert.false(Json.is(true), 'boolean');
	}

	testEncode() {
		Assert.strictEqual(Json.encode(), '', 'passing nothing should return a blank string');
		Assert.strictEqual(Json.encode(null), '', 'passing null should return a blank string');
		Assert.equal(Json.encode([]), '[]', 'empty array');
		Assert.equal(Json.encode({}), '{}', 'empty object');

		var actual = Json.encode([
			'a',
			'b',
			'c',
		]);
		var expected = '["a","b","c"]';
		Assert.equal(actual, expected, 'array');

		actual = Json.encode({
			'a': 1,
			'b': 2,
			'c': 3,
		});
		expected = '{"a":1,"b":2,"c":3}';
		Assert.equal(actual, expected, 'object');

		actual = Json.encode({
			a: 1,
			fn() {
				var a = 'test';
			}
		});
		expected = '{"a":1}';
		Assert.equal(actual, expected, 'functions are not encoded and keys pointing to functions are not visible');
	}

	testDecode() {
		Assert.strictEqual(Json.decode(), null, 'passing nothing should return null');
		Assert.strictEqual(Json.decode(null), null, 'passing null should return null');
		Assert.deepEqual(Json.decode('[]'), [], 'empty array');
		Assert.deepEqual(Json.decode('{}'), {}, 'empty object');

		var actual = Json.decode('["a","b","c"]');
		var expected = [
			'a',
			'b',
			'c',
		];
		Assert.deepEqual(actual, expected, 'array');

		actual = Json.decode('{"a":1,"b":2,"c":3}');
		expected = {
			'a': 1,
			'b': 2,
			'c': 3,
		};
		Assert.deepEqual(actual, expected, 'object');
	}

	testDecycle() {
		var actual = {
			fruit: 'apple',
		};
		actual.cyclicalReference = actual;
		actual = Json.decycle(actual);
		//app.log(actual);

		var expected = {
			fruit: 'apple',
			cyclicalReference: {
				'$reference': '$',
			},
		};		

		Assert.deepEqual(actual, expected);
	}

	testRetrocycle() {
		var actual = {
			fruit: 'apple',
			cyclicalReference: {
				'$reference': '$',
			},
		};
		actual = Json.retrocycle(actual);
		
		Assert.equal(actual.cyclicalReference.fruit, 'apple');
	}

}

// Export
export default JsonTest;

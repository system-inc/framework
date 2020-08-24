// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Stopwatch } from '@framework/system/time/Stopwatch.js';

// Class
class FunctionTest extends Test {

	testIs() {
		Assert.true(Function.is(function() {}), 'function');
		Assert.false(Function.is(), 'nothing');
		Assert.false(Function.is(null), 'null');
		Assert.false(Function.is(1), 'number');
		Assert.false(Function.is(''), 'empty string');
		Assert.false(Function.is('string'), 'string');
		Assert.false(Function.is([]), 'array');
		Assert.false(Function.is({}), 'object');
	}

	testGetParameters() {
		var fn = function(apple, banana, cherry) {
		}
		var actual = fn.getParameters();
		//app.info('actual', actual);
		var expected = [
			'apple',
			'banana',
			'cherry',
		];
		Assert.deepEqual(actual, expected, 'parameters are returned as an array')

		class SpecialTestClass {
			async asyncFunction(parameter1, parameter2) {
			}
		}
		var specialTestClassInstance = new SpecialTestClass();
		var actual = specialTestClassInstance.asyncFunction.getParameters();
		//app.info('actual', actual);
		var expected = [
			'parameter1',
			'parameter2',
		];
		Assert.deepEqual(actual, expected, 'parameters in asyncFunction functions defined in classes');
	}

	async testDelay() {
		var stopwatch = new Stopwatch();
		await Function.delay(50);
		stopwatch.stop();
		//app.log(stopwatch.elapsedTime);

		// http://stackoverflow.com/questions/21097421/what-is-the-reason-javascript-settimeout-is-so-inaccurate
		Assert.greaterThanOrEqualTo(stopwatch.elapsedTime, 35, 'delaying 50 milliseconds should make the stopwatch elapsed time at least 35 (50 +/- 15) milliseconds');
		Assert.lessThanOrEqualTo(stopwatch.elapsedTime, 65, 'delaying 50 milliseconds should make the stopwatch elapsed time at least 65 (50 +/- 15) milliseconds');
	}

	// TODO: Make this work at some point
	//testIsAsync() {
	//	Assert.true(Function.isAsync(async function() {}), 'async function');
	//	Assert.true(Function.isAsync(async function() {}.bind(this)), 'async function with .bind(this) called on it');
	//	Assert.false(Function.isAsync(function() {}), 'function');
	//	Assert.false(Function.isAsync(), 'nothing');
	//	Assert.false(Function.isAsync(null), 'null');
	//	Assert.false(Function.isAsync(1), 'number');
	//	Assert.false(Function.isAsync(''), 'empty string');
	//	Assert.false(Function.isAsync('string'), 'string');
	//	Assert.false(Function.isAsync([]), 'array');
	//	Assert.false(Function.isAsync({}), 'object');
	//}

	// TODO: Make this work at some point
	//testPrototypeIsAsync() {
	//	var fn = function() {
	//	}

	//	var asyncFunction = async function() {
	//	}

	//	Assert.false(fn.isAsync(), 'function');
	//	Assert.true(asyncFunction.isAsync(), 'asyncFunction');
	//	Assert.true(asyncFunction.bind(this).isAsync(), 'asyncFunction function with .bind(this) called on it');
	//}

	bindWithGeneratorTestObject = {
		'apple': 'macintosh',
		'banana': 'chiquita',
		'cherry': 'kirkland',
	}

	async testBindWithAsyncFunction() {
		var asyncFunction = async function(parameter1, parameter2) {
			Assert.equal(parameter1, 'parameter1', 'passing parameters works');
			Assert.equal(parameter2, 'parameter2', 'verifying passing parameters works');
			
			return this.bindWithGeneratorTestObject;
		}.bind(this);

		var actual = await asyncFunction('parameter1', 'parameter2');
		Assert.strictEqual(actual, this.bindWithGeneratorTestObject, 'context was passed and used to return a value');
	}

	async testRun() {
		// Async function just returns a string
		var asyncFunction = async function() {
			return 'hello';
		}

		var actual = await asyncFunction();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the asyncFunction');

		// Async function awaits on a string and returns it
		asyncFunction = async function() {
			var result = await 'hello';
			return result;
		}

		actual = await asyncFunction();
		Assert.equal(actual, 'hello', 'returning awaited string, returns the result of the asyncFunction');

		// Yield on return
		asyncFunction = async function() {
			return await 'hello';
		}

		actual = await asyncFunction();
		Assert.equal(actual, 'hello', 'returning awaited string inline, returns the result of the asyncFunction');
	}

	async testRunWithBind() {
		// Async function just returns a string
		var asyncFunction = async function() {
			return 'hello';
		}.bind(this);

		var actual = await asyncFunction();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the asyncFunction');

		// Async function awaits on a string and returns it
		asyncFunction = async function() {
			var result = await 'hello';
			return result;
		}.bind(this);

		actual = await asyncFunction();
		Assert.equal(actual, 'hello', 'returning awaited string, also returns the result of the asyncFunction');
	}

}

// Export
export { FunctionTest };

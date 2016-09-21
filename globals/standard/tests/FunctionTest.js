// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Stopwatch from './../../../system/time/Stopwatch.js';

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
		var expected = [
			'apple',
			'banana',
			'cherry',
		];
		Assert.deepEqual(actual, expected, 'parameters are returned as an array')

		class SpecialTestClass {
			async generatorFunction(parameter1, parameter2) {
			}
		}
		var specialTestClassInstance = new SpecialTestClass();
		var actual = specialTestClassInstance.generatorFunction.getParameters();
		var expected = [
			'parameter1',
			'parameter2',
		];
		Assert.deepEqual(actual, expected, 'parameters in generator functions defined in classes')
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

	testIsAsync() {
		// TODO: Need to rewrite these tests for async instead of generators
		Assert.true(Generator.is(async function() {}), 'generator function');
		Assert.true(Generator.is(async function() {}.bind(this)), 'generator function with .bind(this) called on it');
		Assert.false(Generator.is(function() {}), 'function');
		Assert.false(Generator.is(), 'nothing');
		Assert.false(Generator.is(null), 'null');
		Assert.false(Generator.is(1), 'number');
		Assert.false(Generator.is(''), 'empty string');
		Assert.false(Generator.is('string'), 'string');
		Assert.false(Generator.is([]), 'array');
		Assert.false(Generator.is({}), 'object');
	}

	testIsGenerator() {
		Assert.true(Function.isGenerator(async function() {}), 'generator function');
		Assert.true(Function.isGenerator(async function() {}.bind(this)), 'generator function with .bind(this) called on it');
		Assert.false(Function.isGenerator(function() {}), 'function');
		Assert.false(Function.isGenerator(), 'nothing');
		Assert.false(Function.isGenerator(null), 'null');
		Assert.false(Function.isGenerator(1), 'number');
		Assert.false(Function.isGenerator(''), 'empty string');
		Assert.false(Function.isGenerator('string'), 'string');
		Assert.false(Function.isGenerator([]), 'array');
		Assert.false(Function.isGenerator({}), 'object');
	}

	testPrototypeIsGenerator() {
		var fn = function() {
		}

		var generator = async function() {
		}

		Assert.false(fn.isGenerator(), 'function');
		Assert.true(generator.isGenerator(), 'generator');
		Assert.true(generator.bind(this).isGenerator(), 'generator function with .bind(this) called on it');
	}

	bindWithGeneratorTestObject = {
		'apple': 'macintosh',
		'banana': 'chiquita',
		'cherry': 'kirkland',
	}

	async testBindWithGenerator() {
		var generatorFunction = async function(parameter1, parameter2) {
			Assert.equal(parameter1, 'parameter1', 'passing parameters works');
			Assert.equal(parameter2, 'parameter2', 'verifying passing parameters works');
			
			return this.bindWithGeneratorTestObject;
		}.bind(this);

		var actual = await Generator.run(generatorFunction('parameter1', 'parameter2'));
		Assert.strictEqual(actual, this.bindWithGeneratorTestObject, 'context was passed and used to return a value');
	}

	async testRun() {
		// Generator just returns a string
		var generator = async function() {
			return 'hello';
		}

		var actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator awaits on a string and returns it
		generator = async function() {
			var result = await 'hello';
			return result;
		}

		actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning awaited string, returns the result of the generator');

		// Yield on return
		generator = async function() {
			return await 'hello';
		}

		actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning awaited string inline, returns the result of the generator');
	}

	async testRunWithBind() {
		// Generator just returns a string
		var generator = async function() {
			return 'hello';
		}.bind(this);

		var actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator awaits on a string and returns it
		generator = async function() {
			var result = await 'hello';
			return result;
		}.bind(this);

		actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning awaited string, also returns the result of the generator');
	}

	async testPrototypeRun() {
		// Generator just returns a string
		var generator = async function() {
			return 'hello';
		}.bind(this);

		var actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator awaits on a string and returns it
		generator = async function() {
			var result = await 'hello';
			return result;
		}.bind(this);

		actual = await generator.run();
		Assert.equal(actual, 'hello', 'returning awaited string, also returns the result of the generator');

		// Generator receives arguments
		generator = async function(argument) {
			var value = await argument;
			return value;
		}.bind(this);

		actual = await generator.run('hello');
		Assert.equal(actual, 'hello', 'returning the argument, also returns the result of the generator');
	}

}

// Export
export default FunctionTest;

// Dependencies
var Stopwatch = Framework.require('modules/time/Stopwatch.js');

// Class
var FunctionTest = Test.extend({

	testIs: function() {
		Assert.true(Function.is(function() {}), 'function');
		Assert.false(Function.is(), 'nothing');
		Assert.false(Function.is(null), 'null');
		Assert.false(Function.is(1), 'number');
		Assert.false(Function.is(''), 'empty string');
		Assert.false(Function.is('string'), 'string');
		Assert.false(Function.is([]), 'array');
		Assert.false(Function.is({}), 'object');
	},

	testIsGenerator: function() {
		Assert.true(Function.isGenerator(function*() {}), 'generator function');
		Assert.true(Function.isGenerator(function*() {}.bind(this)), 'generator function with .bind(this) called on it');
		Assert.false(Function.isGenerator(function() {}), 'function');
		Assert.false(Function.isGenerator(), 'nothing');
		Assert.false(Function.isGenerator(null), 'null');
		Assert.false(Function.isGenerator(1), 'number');
		Assert.false(Function.isGenerator(''), 'empty string');
		Assert.false(Function.isGenerator('string'), 'string');
		Assert.false(Function.isGenerator([]), 'array');
		Assert.false(Function.isGenerator({}), 'object');
	},

	testPrototypeIsGenerator: function() {
		var fn = function() {
		}

		var generator = function*() {
		}

		Assert.false(fn.isGenerator(), 'function');
		Assert.true(generator.isGenerator(), 'generator');
		Assert.true(generator.bind(this).isGenerator(), 'generator function with .bind(this) called on it');
	},

	testGetParameters: function() {
		var fn = function(apple, banana, cherry) {
		}
		var actual = fn.getParameters();
		var expected = [
			'apple',
			'banana',
			'cherry',
		];
		Assert.deepEqual(actual, expected, 'parameters are returned as an array')

		var SpecialTestClass = Class.extend({
			generatorFunction: function*(parameter1, parameter2) {
			},
		});
		var specialTestClassInstance = new SpecialTestClass();
		var actual = specialTestClassInstance.generatorFunction.getParameters();
		var expected = [
			'parameter1',
			'parameter2',
		];
		Assert.deepEqual(actual, expected, 'parameters in generator functions defined in classes')
	},

	testDelay: function*() {
		var stopwatch = new Stopwatch();
		yield Function.delay(50);
		stopwatch.stop();
		//Console.log(stopwatch.elapsedTime);

		// http://stackoverflow.com/questions/21097421/what-is-the-reason-javascript-settimeout-is-so-inaccurate
		Assert.greaterThanOrEqualTo(stopwatch.elapsedTime, 25, 'delaying 50 milliseconds should make the stopwatch elapsed time at least 25 milliseconds');
	},

	bindWithGeneratorTestObject: {
		'apple': 'macintosh',
		'banana': 'chiquita',
		'cherry': 'kirkland',
	},

	testBindWithGenerator: function*() {
		var generatorFunction = function*(parameter1, parameter2) {
			Assert.equal(parameter1, 'parameter1', 'passing parameters works');
			Assert.equal(parameter2, 'parameter2', 'verifying passing parameters works');
			
			return this.bindWithGeneratorTestObject;
		}.bind(this);

		var actual = yield Generator.run(generatorFunction('parameter1', 'parameter2'));
		Assert.strictEqual(actual, this.bindWithGeneratorTestObject, 'context was passed and used to return a value');
	},

});

// Export
module.exports = FunctionTest;
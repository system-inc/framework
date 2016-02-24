// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');
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

});

// Export
module.exports = FunctionTest;
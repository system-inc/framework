FunctionTest = Test.extend({

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

	testisGenerator: function() {
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
		yield Function.delay(3);
		stopwatch.stop();
		//Console.out(stopwatch.elapsedTime);

		// TODO: This is weird since you would think it would always take at least *3* milliseconds before the stopwatch is stopped
		// Sometimes when this runs it returns in 2.5+ milliseconds (shorter than 3 milliseconds)
		Assert.greaterThanOrEqualTo(stopwatch.elapsedTime, 2, 'delaying 3 milliseconds should make the stopwatch elapsed time at least 2 milliseconds');
	},

});
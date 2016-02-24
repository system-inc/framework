// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');

// Class
var GeneratorTest = Test.extend({

	testIs: function() {
		Assert.true(Generator.is(function*() {}), 'generator function');
		Assert.true(Generator.is(function*() {}.bind(this)), 'generator function with .bind(this) called on it');
		Assert.false(Generator.is(function() {}), 'function');
		Assert.false(Generator.is(), 'nothing');
		Assert.false(Generator.is(null), 'null');
		Assert.false(Generator.is(1), 'number');
		Assert.false(Generator.is(''), 'empty string');
		Assert.false(Generator.is('string'), 'string');
		Assert.false(Generator.is([]), 'array');
		Assert.false(Generator.is({}), 'object');
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

	testRun: function*() {
		// Generator just returns a string
		var generator = function*() {
			return 'hello';
		}

		var actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator yields on a string and returns it
		generator = function*() {
			var result = yield 'hello';
			return result;
		}

		actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning yielded string, returns the result of the generator');

		// Yield on return
		generator = function*() {
			return yield 'hello';
		}

		actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning yielded string inline, returns the result of the generator');
	},

	testRunWithBind: function*() {
		// Generator just returns a string
		var generator = function*() {
			return 'hello';
		}.bind(this);

		var actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator yields on a string and returns it
		generator = function*() {
			var result = yield 'hello';
			return result;
		}.bind(this);

		actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning yielded string, also returns the result of the generator');
	},

	testPrototypeRun: function*() {
		// Generator just returns a string
		var generator = function*() {
			return 'hello';
		}.bind(this);

		var actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator yields on a string and returns it
		generator = function*() {
			var result = yield 'hello';
			return result;
		}.bind(this);

		actual = yield generator.run();
		Assert.equal(actual, 'hello', 'returning yielded string, also returns the result of the generator');

		// Generator receives arguments
		generator = function*(argument) {
			var value = yield argument;
			return value;
		}.bind(this);

		actual = yield generator.run('hello');
		Assert.equal(actual, 'hello', 'returning the argument, also returns the result of the generator');
	},

});

// Export
module.exports = GeneratorTest;
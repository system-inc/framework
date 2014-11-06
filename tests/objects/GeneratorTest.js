GeneratorTest = Test.extend({

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

	testRun: function() {
		var generator = function*() {
			var result = yield 'hello';
			return result;
		}

		var actual = Generator.run(generator);
		var expected = 'hello';
		// Not sure if this is actually important that it does this or if it will do this all of the time
		Assert.equal(actual, expected, 'returns the result of the generator');
	},

});
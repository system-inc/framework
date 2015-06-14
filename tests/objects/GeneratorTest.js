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

	testRun: function*() {
		// Generator just returns a string
		var generator = function*() {
			return 'hello';
		}

		var actual = yield Generator.run(generator);
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator yields on a string and returns it
		generator = function*() {
			var result = yield 'hello';
			return result;
		}

		actual = yield Generator.run(generator);
		Assert.equal(actual, 'hello', 'returning yielded string, returns the result of the generator');
	},

	testRunWithBind: function*() {
		// Generator just returns a string
		var generator = function*() {
			return 'hello';
		}.bind(this);

		var actual = yield Generator.run(generator);
		Assert.equal(actual, 'hello', 'returning string, returns the result of the generator');

		// Generator yields on a string and returns it
		generator = function*() {
			var result = yield 'hello';
			return result;
		}.bind(this);

		actual = yield Generator.run(generator);
		Assert.equal(actual, 'hello', 'returning yielded string, also returns the result of the generator');
	},

});
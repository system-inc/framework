// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');

// Class
var ErrorTest = Test.extend({

	testError: function() {
		var actual = new Error();

		Assert.true(actual.hasKey('identifier'), 'has identifier');
		Assert.true(actual.hasKey('message'), 'has message');
		Assert.true(actual.hasKey('location'), 'has location');
		Assert.true(actual.hasKey('data'), 'has data');
		Assert.true(actual.hasKey('time'), 'has time');
		Assert.true(actual.hasKey('stackTrace'), 'has stackTrace');

		//console.info(actual);
		//console.info(actual.toString());
	},

	testReferenceError: function*() {
		var actual;

		try {
			// Throw a ReferenceError
			eval('zzz');
		}
		catch(error) {
			actual = error;
		}

		console.warn(actual);
		console.warn(actual.toString());

		Assert.true(actual.hasKey('identifier'), 'has identifier');
		Assert.true(actual.hasKey('message'), 'has message');
		Assert.true(actual.hasKey('location'), 'has location');
		Assert.true(actual.hasKey('data'), 'has data');
		Assert.true(actual.hasKey('time'), 'has time');
		Assert.true(actual.hasKey('stackTrace'), 'has stackTrace');
	},

	//Error
	//EvalError
	//InternalError
	//RangeError
	//ReferenceError
	//SyntaxError
	//TypeError
	//URIError

});

// Export
module.exports = ErrorTest;
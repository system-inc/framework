// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var ErrorTest = Test.extend({

	testErrorConstruction: function() {
		var actual = new Error('testErrorConstruction error message.');

		Assert.equal(actual.identifier, 'Error', 'identifier is set correctly');
		Assert.equal(actual.message, 'testErrorConstruction error message.', 'message is set correctly');
		Assert.true(actual.location, 'has location');
		Assert.true(Class.isInstance(actual.time, Time), 'time is set correctly');
		Assert.true(actual.stackTrace, 'has stackTrace');

		Console.info(actual);
		//Console.info(actual.toString());
	},

	testThrowError: function() {
		var actual = null;

		try {
			throw new Error('testThrowError error message.');
		}
		catch(error) {
			actual = error;
		}

		Assert.equal(actual.identifier, 'Error', 'identifier is set correctly');
		Assert.equal(actual.message, 'testThrowError error message.', 'message is set correctly');
		Assert.true(actual.location, 'has location');
		Assert.true(Class.isInstance(actual.time, Time), 'time is set correctly');
		Assert.true(actual.stackTrace, 'has stackTrace');

		Console.info(actual);
		//Console.info(actual.toString());
	},

	//testThrowReferenceError: function*() {
	//	var actual = null;

	//	try {
	//		// Throw a ReferenceError
	//		eval('zzz');
	//	}
	//	catch(error) {
	//		actual = error;
	//	}

	//	Console.warn(actual);
	//	Console.warn(actual.toString());

	//	Assert.true(actual.hasKey('identifier'), 'has identifier');
	//	Assert.true(actual.hasKey('message'), 'has message');
	//	Assert.true(actual.hasKey('location'), 'has location');
	//	Assert.true(actual.hasKey('data'), 'has data');
	//	Assert.true(actual.hasKey('time'), 'has time');
	//	Assert.true(actual.hasKey('stackTrace'), 'has stackTrace');
	//},

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
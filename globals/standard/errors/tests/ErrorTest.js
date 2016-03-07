// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var ErrorTest = Test.extend({

	testErrorConstruction: function*() {
		var actual = new Error('testErrorConstruction error message.');

		Console.info(actual);
		Console.info(actual.toString());

		//Assert.true(Error.is(actual), 'Error.is()');
		//Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		//Assert.equal(actual.identifier, 'Error', 'identifier is set correctly');
		//Assert.equal(actual.message, 'testErrorConstruction error message.', 'message is set correctly');
		//Assert.true(actual.location, 'has location');
		//Assert.true(actual.location.contains('ErrorTest.js'), 'location is accurate');
		//Assert.true(Class.isInstance(actual.time, Time), 'time is set correctly');
		//Assert.true(actual.stackTrace, 'has stackTrace');
		//Assert.true(Object.is(actual.toObject()), 'toObject()');
		//Assert.true(String.is(actual.toJson()), 'toJson()');

		//var publicObject = actual.toPublicObject();
		//Assert.false(publicObject.hasKey('location'), 'toPublicObject() does not have location');
		//Assert.false(publicObject.hasKey('stack'), 'toPublicObject() does not have stack');
		//Assert.false(publicObject.hasKey('stackTrace'), 'toPublicObject() does not have stackTrace');
	},

	//testThrowError: function*() {
	//	var actual = null;

	//	try {
	//		throw new Error('testThrowError error message.');
	//	}
	//	catch(error) {
	//		actual = error;
	//	}

	//	//Console.info(actual);
	//	//Console.info(actual.toString());

	//	Assert.true(Error.is(actual), 'Error.is()');
	//	Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
	//	Assert.equal(actual.identifier, 'Error', 'identifier is set correctly');
	//	Assert.equal(actual.message, 'testThrowError error message.', 'message is set correctly');
	//	Assert.true(actual.location, 'has location');
	//	Assert.true(actual.location.contains('ErrorTest.js'), 'location is accurate');
	//	Assert.true(Class.isInstance(actual.time, Time), 'time is set correctly');
	//	Assert.true(actual.stackTrace, 'has stackTrace');
	//	Assert.true(Object.is(actual.toObject()), 'toObject()');
	//	Assert.true(String.is(actual.toJson()), 'toJson()');

	//	var publicObject = actual.toPublicObject();
	//	Assert.false(publicObject.hasKey('location'), 'toPublicObject() does not have location');
	//	Assert.false(publicObject.hasKey('stack'), 'toPublicObject() does not have stack');
	//	Assert.false(publicObject.hasKey('stackTrace'), 'toPublicObject() does not have stackTrace');
	//},

	//testThrowReferenceError: function() {

		//Assert.equal('hi', 'ho', 'message');

		//var actual = null;
	

		//try {
			// Throw a ReferenceError
			//eval('zzz');
		//}
		//catch(error) {
			//actual = error;
		//}

		//Console.warn(actual.toString());
		//Console.warn(actual.stack);
		//Console.warn(actual.toObject);

		//Assert.true(Error.is(actual), 'Error.is()');
		//Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		//Assert.true(Class.isInstance(actual, ReferenceError), 'is instance of ReferenceError');

		//Console.warn(actual);
		//Console.warn(actual.toString());
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
// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var ErrorTest = Test.extend({

	testErrorConstruction: function*() {
		var actual = new Error('testErrorConstruction error message.');
		//Console.info(actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.equal(actual.name, 'Error', 'name is set correctly');
		Assert.equal(actual.message, 'testErrorConstruction error message.', 'message is set correctly');
	},

	testThrowError: function*() {
		var actual = null;

		try {
			throw new Error('testThrowError error message.');
		}
		catch(error) {
			actual = error;
		}
		//Console.info(actual);
		
		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.equal(actual.name, 'Error', 'name is set correctly');
		Assert.equal(actual.message, 'testThrowError error message.', 'message is set correctly');
	},

	testCatchReferenceErrorInNormalFunction: function() { // <- this is a normal function, not a generator
		var actual = null;

		try {
			// Throw a ReferenceError
			eval('zzz');
		}
		catch(error) {
			actual = error;
		}
		//Console.info(actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, ReferenceError), 'is instance of ReferenceError');
		Assert.equal(actual.name, 'ReferenceError', 'name is set correctly');
		Assert.equal(actual.message, 'zzz is not defined', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//Console.info(firstCallSiteData);
		Assert.equal(firstCallSiteData.functionName, 'eval', 'first call site data is correct');
		
		var secondCallSiteData = actual.stack.getCallSiteData(1);
		//Console.info(secondCallSiteData);
		Assert.true(secondCallSiteData.functionName.contains('testCatchReferenceErrorInNormalFunction'), 'second call site data function name is correct');
		Assert.equal(secondCallSiteData.fileName, 'ErrorTest.js', 'second call site data fileName is correct');
	},

	testCatchReferenceErrorInGeneratorFunction: function*() {
		var actual = null;

		try {
			// Throw a ReferenceError
			eval('zzz');
		}
		catch(error) {
			actual = error;
		}
		//Console.info(actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, ReferenceError), 'is instance of ReferenceError');
		Assert.equal(actual.name, 'ReferenceError', 'name is set correctly');
		Assert.equal(actual.message, 'zzz is not defined', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//Console.info(firstCallSiteData);
		Assert.equal(firstCallSiteData.functionName, 'eval', 'first call site data is correct');
		
		var secondCallSiteData = actual.stack.getCallSiteData(1);
		//Console.info(secondCallSiteData);
		Assert.true(secondCallSiteData.functionName.contains('testCatchReferenceErrorInGeneratorFunction'), 'second call site data function name is correct');
		Assert.equal(secondCallSiteData.fileName, 'ErrorTest.js', 'second call site data fileName is correct');
	},

});

// Export
module.exports = ErrorTest;
// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HttpError = Framework.require('system/web-server/errors/HttpError.js');
var NotFoundError = Framework.require('system/web-server/errors/NotFoundError.js');

// Class
var NotFoundErrorTest = Test.extend({

	testNotFoundErrorConstruction: function() {
		var actual = new NotFoundError('testNotFoundErrorConstruction error message.');
		//Console.info(actual);
		//Console.info(Error.toObject(actual));
		
		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, HttpError), 'is instance of HttpError');
		Assert.true(Class.isInstance(actual, NotFoundError), 'is instance of NotFoundError');
		Assert.equal(actual.name, 'NotFoundError', 'name is set correctly');
		Assert.equal(actual.identifier, 'notFoundError', 'identifier is set correctly');
		Assert.equal(actual.code, 404, 'code is set correctly');
		Assert.equal(actual.message, 'testNotFoundErrorConstruction error message.', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//Console.info(firstCallSiteData);
		Assert.true(firstCallSiteData.functionName.contains('testNotFoundErrorConstruction'), 'first call site data functionName is correct');
		Assert.equal(firstCallSiteData.fileName, 'NotFoundErrorTest.js', 'first call site data fileName is correct');
	},

});

// Export
module.exports = NotFoundErrorTest;
// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var HttpError = Framework.require('system/web-server/errors/HttpError.js');

// Class
var HttpErrorTest = Test.extend({

	testHttpErrorConstruction: function() {
		var actual = new HttpError('testHttpErrorConstruction error message.');
		//Console.info(actual);
		//Console.info(Error.toObject(actual));

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, HttpError), 'is instance of HttpError');
		Assert.equal(actual.name, 'HttpError', 'name is set correctly');
		Assert.equal(actual.identifier, 'httpError', 'identifier is set correctly');
		Assert.equal(actual.code, null, 'code is set correctly');
		Assert.equal(actual.message, 'testHttpErrorConstruction error message.', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//Console.info(firstCallSiteData);
		Assert.true(firstCallSiteData.functionName.contains('testHttpErrorConstruction'), 'first call site data functionName is correct');
		Assert.equal(firstCallSiteData.fileName, 'HttpErrorTest.js', 'first call site data fileName is correct');
	},

});

// Export
module.exports = HttpErrorTest;
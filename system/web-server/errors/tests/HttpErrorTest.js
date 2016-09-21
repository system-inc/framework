// Dependencies
import Test from './../../../../system/test/Test.js';
import Assert from './../../../../system/test/Assert.js';
import HttpError from './../../../../system/web-server/errors/HttpError.js';

// Class
class HttpErrorTest extends Test {

	testHttpErrorConstruction() {
		var actual = new HttpError('testHttpErrorConstruction error message.');
		//app.info(actual);
		//app.info(Error.toObject(actual));

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, HttpError), 'is instance of HttpError');
		Assert.equal(actual.name, 'HttpError', 'name is set correctly');
		Assert.equal(actual.identifier, 'httpError', 'identifier is set correctly');
		Assert.equal(actual.code, null, 'code is set correctly');
		Assert.equal(actual.message, 'testHttpErrorConstruction error message.', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//app.info(firstCallSiteData);
		Assert.true(firstCallSiteData.functionName.contains('testHttpErrorConstruction'), 'first call site data functionName is correct');
		Assert.equal(firstCallSiteData.fileName, 'HttpErrorTest.js', 'first call site data fileName is correct');
	}

}

// Export
export default HttpErrorTest;

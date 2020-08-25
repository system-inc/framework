// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { HttpError } from '@framework/system/web/server/errors/HttpError.js';
import { NotFoundError } from '@framework/system/web/server/errors/NotFoundError.js';

// Class
class NotFoundErrorTest extends Test {

	testNotFoundErrorConstruction() {
		var actual = new NotFoundError('testNotFoundErrorConstruction error message.');
		//app.info(Error.toObject(actual));
		//app.info(actual);
		
		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, HttpError), 'is instance of HttpError');
		Assert.true(Class.isInstance(actual, NotFoundError), 'is instance of NotFoundError');
		Assert.equal(actual.name, 'NotFoundError', 'name is set correctly');
		Assert.equal(actual.identifier, 'notFoundError', 'identifier is set correctly');
		Assert.equal(actual.code, 404, 'code is set correctly');
		Assert.equal(actual.message, 'testNotFoundErrorConstruction error message.', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSite(0);
		//app.info(firstCallSiteData);
		Assert.true(firstCallSiteData.functionName.contains('testNotFoundErrorConstruction'), 'first call site data functionName is correct');
		Assert.true(firstCallSiteData.fileName.contains('NotFoundErrorTest.js'), 'first call site data fileName is correct');
	}

}

// Export
export { NotFoundErrorTest };

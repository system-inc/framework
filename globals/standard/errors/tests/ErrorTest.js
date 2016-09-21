// Dependencies
import Test from './../../../../system/test/Test.js';
import Assert from './../../../../system/test/Assert.js';

// Class
class ErrorTest extends Test {

	async testErrorConstruction() {
		var actual = new Error('testErrorConstruction error message.');
		//app.info(actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.equal(actual.name, 'Error', 'name is set correctly');
		Assert.equal(actual.message, 'testErrorConstruction error message.', 'message is set correctly');
	}

	async testThrowError() {
		var actual = null;

		try {
			throw new Error('testThrowError error message.');
		}
		catch(error) {
			actual = error;
		}
		//app.info(actual);
		
		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.equal(actual.name, 'Error', 'name is set correctly');
		Assert.equal(actual.message, 'testThrowError error message.', 'message is set correctly');
	}

	testCatchReferenceErrorInNormalFunction() { // <- this is a normal function, not a generator
		var actual = null;

		try {
			// Throw a ReferenceError
			eval('zzz');
		}
		catch(error) {
			actual = error;
		}
		app.info('actual', actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, ReferenceError), 'is instance of ReferenceError');
		Assert.equal(actual.name, 'ReferenceError', 'name is set correctly');
		Assert.equal(actual.message, 'zzz is not defined', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//app.info(firstCallSiteData);
		Assert.equal(firstCallSiteData.functionName, 'eval', 'first call site data is correct');
		
		var secondCallSiteData = actual.stack.getCallSiteData(1);
		//app.info(secondCallSiteData);
		Assert.true(secondCallSiteData.functionName.contains('testCatchReferenceErrorInNormalFunction'), 'second call site data function name is correct');
		Assert.equal(secondCallSiteData.fileName, 'ErrorTest.js', 'second call site data fileName is correct');
	}

	async testCatchReferenceErrorInGeneratorFunction() {
		var actual = null;

		try {
			// Throw a ReferenceError
			eval('zzz');
		}
		catch(error) {
			actual = error;
		}
		//app.info(actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, ReferenceError), 'is instance of ReferenceError');
		Assert.equal(actual.name, 'ReferenceError', 'name is set correctly');
		Assert.equal(actual.message, 'zzz is not defined', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSiteData(0);
		//app.info(firstCallSiteData);
		Assert.equal(firstCallSiteData.functionName, 'eval', 'first call site data is correct');
		
		var secondCallSiteData = actual.stack.getCallSiteData(1);
		//app.info(secondCallSiteData);
		Assert.true(secondCallSiteData.functionName.contains('testCatchReferenceErrorInGeneratorFunction'), 'second call site data function name is correct');
		Assert.equal(secondCallSiteData.fileName, 'ErrorTest.js', 'second call site data fileName is correct');
	}

}

// Export
export default ErrorTest;

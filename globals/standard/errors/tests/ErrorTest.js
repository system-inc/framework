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
		Assert.strictEqual(actual.name, 'Error', 'name is set correctly');
		Assert.strictEqual(actual.message, 'testErrorConstruction error message.', 'message is set correctly');
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
		Assert.strictEqual(actual.name, 'Error', 'name is set correctly');
		Assert.strictEqual(actual.message, 'testThrowError error message.', 'message is set correctly');
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
		//app.info('actual', actual);

		Assert.true(Error.is(actual), 'Error.is()');
		Assert.true(Class.isInstance(actual, Error), 'is instance of Error');
		Assert.true(Class.isInstance(actual, ReferenceError), 'is instance of ReferenceError');
		Assert.strictEqual(actual.name, 'ReferenceError', 'name is set correctly');
		Assert.strictEqual(actual.message, 'zzz is not defined', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSite(0);
		//app.info('firstCallSiteData', firstCallSiteData);
		Assert.strictEqual(firstCallSiteData.functionName, 'eval', 'first call site is correct');
		
		var secondCallSiteData = actual.stack.getCallSite(1);
		//app.info('secondCallSiteData', secondCallSiteData);
		Assert.true(secondCallSiteData.functionName.contains('testCatchReferenceErrorInNormalFunction'), 'second call site function name is correct');
		Assert.strictEqual(secondCallSiteData.fileName, 'ErrorTest.js', 'second call site fileName is correct');
		Assert.strictEqual(secondCallSiteData.lineNumber, 40, 'second call site line number is correct');
	}

	async testCatchReferenceErrorInAsyncFunction() {
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
		Assert.strictEqual(actual.name, 'ReferenceError', 'name is set correctly');
		Assert.strictEqual(actual.message, 'zzz is not defined', 'message is set correctly');

		var firstCallSiteData = actual.stack.getCallSite(0);
		//app.info('firstCallSiteData', firstCallSiteData);
		Assert.strictEqual(firstCallSiteData.functionName, 'eval', 'first call site is correct');
		
		var secondCallSiteData = actual.stack.getCallSite(1);
		//app.info('secondCallSiteData', Json.indent(secondCallSiteData));
		//app.info(actual.stack.toString());
		// TODO: Make this test work, right now in Babel it is calling the function name _callee3$
		//Assert.true(secondCallSiteData.functionName.contains('testCatchReferenceErrorInGeneratorFunction'), 'second call site function name is correct');
		Assert.strictEqual(secondCallSiteData.fileName, 'ErrorTest.js', 'second call site fileName is correct');
		Assert.strictEqual(secondCallSiteData.lineNumber, 69, 'second call site line number is correct');
	}

}

// Export
export default ErrorTest;

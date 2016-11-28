// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import NotFoundError from 'framework/system/server/web/errors/NotFoundError.js';
import InternalServerError from 'framework/system/server/web/errors/InternalServerError.js';

// Class
class AssertTest extends Test {

	async testThrowsAsynchronously() {
		// Should fail
		//await Assert.throwsAsynchronously(async function() {
		//	//throw new Error();
		//}, 'throwsAsynchronously works');

		// Should fail
		//await Assert.doesNotThrowAsynchronously(async function() {
		//	throw new Error();
		//}, 'throwsAsynchronously works');

		await Assert.throwsAsynchronously(async function() {
			throw new Error();
		}, 'throwsAsynchronously works');

		await Assert.throwsAsynchronously(async function() {
			throw new NotFoundError();
		}, NotFoundError, 'throwsAsynchronously works with Error types');

		await Assert.doesNotThrowAsynchronously(async function() {
		}, 'doesNotThrowAsynchronously works');
	}

}

// Export
export default AssertTest;

// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import Stopwatch from 'framework/system/time/Stopwatch.js';

// Class
class StopwatchTest extends Test {

	async testGetHighResolutionElapsedTime() {
		var action = new Stopwatch();
		action.stop();

		Assert.true(Number.is(action.getHighResolutionElapsedTime()), 'getHighResolutionElapsedTime()');
	}

}

// Export
export default StopwatchTest;

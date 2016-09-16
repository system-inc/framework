// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import Stopwatch from './../../../system/time/Stopwatch.js';

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

// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';
import { Stopwatch } from '@framework/system/time/Stopwatch.js';

// Class
class StopwatchTest extends Test {

	async testGetHighResolutionElapsedTime() {
		let actual = new Stopwatch();
		actual.stop();

		Assert.true(Number.is(actual.getHighResolutionElapsedTime()), 'getHighResolutionElapsedTime()');
	}

}

// Export
export { StopwatchTest };

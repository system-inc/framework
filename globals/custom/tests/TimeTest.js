// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class TimeTest extends Test {

	testTime() {
		var time = new Time('1984-06-28 11:11 AM MST');
		//console.log(time);

		Assert.notStrictEqual(time.dateObject, null, 'DateObject is set');
		Assert.notStrictEqual(time.precision, null, 'Precision is set');
	}

}

// Export
export { TimeTest };

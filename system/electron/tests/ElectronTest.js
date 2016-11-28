// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

// Class
class ElectronTest extends Test {

	async shouldRun() {
		var shouldRun = true;

		// If electron isn't in the versions object, we are not in the Electron environment
		if(!Node.Process.versions.electron) {
			shouldRun = false;
		}

		return shouldRun;
	}

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronTest;

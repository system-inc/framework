// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

// Class
class ElectronTest extends Test {

	async shouldRun() {
		return app.inElectronContext();
	}

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronTest;

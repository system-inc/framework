// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';

// Class
class ElectronManagerTest extends ElectronTest {

	async testElectronManager() {
		Assert.true(app.inElectronContext(), 'In Electron context');
	}

}

// Export
export default ElectronManagerTest;

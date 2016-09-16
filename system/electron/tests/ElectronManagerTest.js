// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';
import ElectronTest from './../../../system/electron/tests/ElectronTest.js';

// Class
class ElectronManagerTest extends ElectronTest {

	async testElectronManager() {
		Assert.true(Object.hasKey(Node.Process.versions, 'electron'), 'Electron version is set');
	}

}

// Export
export default ElectronManagerTest;

// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';
import ElectronTest from 'framework/system/electron/tests/ElectronTest.js';

// Class
class ElectronManagerTest extends ElectronTest {

	async testElectronManager() {
		Assert.true(Object.hasKey(Node.Process.versions, 'electron'), 'Electron version is set');
	}

}

// Export
export default ElectronManagerTest;

// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';

// Class
class ModuleTest extends Test {

	testInitialize() {
		// Console is a core module so it should already have been initialized
		Assert.true(Object.hasKey(Project.modules.consoleModule, 'settings'), 'ConsoleModule has key "settings" after Module.initialize()');
	}

}

// Export
export default ModuleTest;

// Dependencies
import Test from './../../../system/test/Test.js';
import Assert from './../../../system/test/Assert.js';

// Class
class ModuleTest extends Test {

	testInitialize() {
		//app.log(Object.keys(app.modules));

		// Console is a core module so it should already have been initialized
		Assert.true(Object.hasKey(app.modules.testModule, 'settings'), 'TestModule has key "settings" after Module.initialize()');
	}

}

// Export
export default ModuleTest;

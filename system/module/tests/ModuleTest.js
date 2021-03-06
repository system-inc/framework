// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { Assert } from '@framework/system/test/Assert.js';

// Class
class ModuleTest extends Test {

	testInitialize() {
		//app.log(Object.keys(app.modules));

		// Console is a core module so it should already have been initialized
		Assert.true(Object.hasKey(app.modules.archiveModule, 'settings'), 'ArchiveModule has key "settings" after Module.initialize()');
	}

}

// Export
export { ModuleTest };

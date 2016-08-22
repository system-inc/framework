// Dependencies
import Module from './../../system/module/Module.js';
import Version from './../../system/version/Version.js';
import Proctor from './../../system/test/Proctor.js';

// Class
class TestModule extends Module {

	version = new Version('0.1.0');
	proctor = null;

	async initialize() {
		await this.super.apply(this, arguments);

		// Create a Proctor to oversee all of the tests as they run
		this.proctor = new Proctor(app.command.options.reporter, app.command.options.breakOnError);
		
		//return; // Debug

		// If test supervising is enabled
		if(app.command.options.supervise) {
			this.proctor.supervise();
		}
		// Get and run the tests
		else {
			this.proctor.getAndRunTests(app.command.options.path, app.command.options.filePattern, app.command.options.methodPattern);
		}
	}
	
}

// Export
module.exports = TestModule;
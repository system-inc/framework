// Dependencies
import Module from './../../system/module/Module.js';
import Version from './../../system/version/Version.js';
import Proctor from './../../system/test/Proctor.js';

// Class
class TestModule extends Module {

	version = new Version('0.1.0');
	proctor = null;

	async initialize() {
		//app.log(' --- TestModule initialize');

		await super.initialize(...arguments);
		
		// Create a Proctor to oversee all of the tests as they run
		this.proctor = new Proctor(app.command.options.reporter, app.command.options.breakOnError);
		//app.log(' proctor created', this.proctor);
		
		//return; // Debug

		// If test supervising is enabled
		if(app.command.options.supervise) {
			this.proctor.supervise();
		}
		// Get and run the tests
		else {
			// If there is no path set the path to the framework directory
			if(!app.command.options.path) {
				app.command.options.path = app.framework.directory;
			}

			//app.log('getAndRunTests', app.command.options.path, app.command.options.filePattern, app.command.options.methodPattern);
			//this.proctor.getAndRunTests(app.command.options.path, app.command.options.filePattern, app.command.options.methodPattern);
			this.proctor.getAndRunTests(Node.Path.join(app.framework.directory, 'globals', 'custom', 'tests'), 'ClassTest', app.command.options.methodPattern);
		}
	}
	
}

// Export
export default TestModule;

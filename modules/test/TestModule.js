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

			//this.proctor.getAndRunTests(app.command.options.path, app.command.options.filePattern, app.command.options.methodPattern);

			// Debug
			var path = null;
			var filePattern = app.command.options.filePattern;
			var methodPattern = app.command.options.methodPattern;
			
			//path = Node.Path.join(app.framework.directory, 'globals');
			//filePattern = '';
			//methodPattern = '';			
			//app.log('path', path, 'filePattern', filePattern, 'methodPattern', methodPattern);
			
			this.proctor.getAndRunTests(path, filePattern, methodPattern);
		}
	}
	
}

// Export
export default TestModule;

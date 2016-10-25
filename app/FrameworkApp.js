// Globals
import './../globals/Globals.js';
import Proctor from './../system/test/Proctor.js';

// Dependencies
import App from './../system/app/App.js';

// Class
class FrameworkApp extends App {

	proctor = null;

	async initialize() {
		await super.initialize(...arguments);
		
		if(this.command.subcommands.proctor) {
			this.proctorCommand();
		}
	}

	async graphicalInterfaceCommand() {
	}

	async proctorCommand() {
		// Create a Proctor to oversee all of the tests as they run
		this.proctor = new Proctor(this.command.subcommands.proctor.options.reporter, this.command.subcommands.proctor.options.breakOnError);
		//app.log('Proctor created', this.proctor);
		//return; // Debug

		// If test supervising is enabled
		if(this.command.subcommands.proctor.options.supervise) {
			this.proctor.supervise();
		}
		// Get and run the tests
		else {
			// If there is no path set the path to the framework directory
			if(!this.command.subcommands.proctor.options.path) {
				this.command.subcommands.proctor.options.path = app.framework.directory;
			}

			//this.proctor.getAndRunTests(this.command.subcommands.proctor.options.path, this.command.subcommands.proctor.options.filePattern, this.command.subcommands.proctor.options.methodPattern);

			// Debug
			var path = this.command.subcommands.proctor.options.path;
			var filePattern = this.command.subcommands.proctor.options.filePattern;
			var methodPattern = this.command.subcommands.proctor.options.methodPattern;
			
			//path = Node.Path.join(app.framework.directory, 'globals');
			//filePattern = 'Command';
			//methodPattern = '';			
			//app.log('path', path, 'filePattern', filePattern, 'methodPattern', methodPattern);
			
			this.proctor.getAndRunTests(path, filePattern, methodPattern);
		}
	}

}

// Global instance
global.app = new FrameworkApp(__dirname);

// Initialize
global.app.initialize();

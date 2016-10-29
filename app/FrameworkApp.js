// Globals
import './../globals/Globals.js';
import AsciiArt from './../system/ascii-art/AsciiArt.js';
import Proctor from './../system/test/Proctor.js';

// Dependencies
import App from './../system/app/App.js';

// Class
class FrameworkApp extends App {

	proctor = null;

	async initialize() {
		await super.initialize(...arguments);
		
		// If in the Electron context
		if(app.inElectronContext()) {
			this.initializeGraphicalInterfaceInElectron();
		}
		// Proctor command
		else if(this.command.subcommands.proctor) {
			this.processCommandProctor();
		}
		// Graphical interface command
		else if(this.command.subcommands.graphicalInterface) {
			this.processCommandGraphicalInterface();
		}
		// Interactive command line interface command
		else if(this.command.subcommands.interactiveCommandLineInterface) {
			// Do nothing
		}
		// Show help by default
		else {
			// Fun with ASCII art
			this.standardStreams.output.writeLine("\n"+AsciiArt.framework.version[this.framework.version.toString()]+"\n");
			this.command.showHelp();
		}
	}

	initializeGraphicalInterfaceInElectron() {
		console.log('initializeGraphicalInterfaceInElectron');
	}

	async processCommandGraphicalInterface() {
		app.log('Loading graphical interface...');
		var electronChildProcess = Node.spawnChildProcess('C:\\Program Files\\Node.js\\node_modules\\electron\\dist\\electron.exe', ['--js-flags="--harmony"', 'app/FrameworkElectronApp.js'], {
		//var electronChildProcess = Node.spawnChildProcess('electron', ['--js-flags="--harmony"', 'app/electron.js'], {
			//cwd: app.framework.directory,
		});

		electronChildProcess.stdout.on('data', function(data) {
			//app.standardStreams.output.write('Electron: '+data.toString());
			app.standardStreams.output.write(data);
		});

		electronChildProcess.stderr.on('data', function(data) {
			//app.standardStreams.error.write('Electron: '+data.toString());
			app.standardStreams.error.write(data);
		});

		electronChildProcess.on('close', function(code) {
			app.standardStreams.output.writeLine('Electron exited with code '+code+'.');
			Node.exit();
		});
	}

	async processCommandProctor() {
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

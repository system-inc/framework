// Globals
import './../globals/Globals.js';
import AsciiArt from 'system/ascii-art/AsciiArt.js';
import GraphicalInterfaceManager from 'system/interface/graphical/GraphicalInterfaceManager.js';
import ElectronGraphicalInterface from 'system/interface/graphical/electron/ElectronGraphicalInterface.js';
import ElectronManager from 'system/interface/graphical/electron/ElectronManager.js';
import Proctor from 'system/test/Proctor.js';

// Dependencies
import App from 'system/app/App.js';

// Class
class FrameworkApp extends App {

	async initialize() {
		await super.initialize(...arguments);
		
		// If in the Electron context
		if(app.inElectronContext()) {
			this.inElectronMainBrowserWindow();
		}
		// Proctor command
		else if(this.interfaces.commandLine.command.subcommands.proctor) {
			this.processCommandProctor();
		}
		// Graphical interface command
		else if(this.interfaces.commandLine.command.subcommands.graphicalInterface) {
			this.processCommandGraphicalInterface();
		}
		// Interactive command line interface command
		else if(this.interfaces.commandLine.command.subcommands.interactiveCommandLineInterface) {
			// Do nothing
		}
		// Show help by default
		else {
			// Fun with ASCII art
			this.standardStreams.output.writeLine("\n"+AsciiArt.framework.version[this.framework.version.toString()]+"\n");
			this.interfaces.commandLine.command.showHelp();
		}
	}

	async processCommandGraphicalInterface() {
		app.log('Loading graphical interface...');

		var pathToElectronExecutable = await ElectronManager.getPathToElectronExecutable();

		app.error(`
			see if it is possible to add lookup paths for require
then I can switch all calls to require('system/') without any ../ garbage
		`);

		app.error(`
			The process I am in now just exists to start the electron process,
		 	I need to pass all standard streams to the child process now and forget about the main process as it is now worthless
	 	`);

		var electronChildProcess = Node.spawnChildProcess(pathToElectronExecutable, ['--js-flags="--harmony"', 'app/FrameworkElectronApp.js']);

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

	// The application process
	inElectron() {
		// TODO: everything in FrameworkElectronApp.js should go here and be reconciled with what is below

		// Create the GraphicalInterfaceManager
		app.interfaces.graphicalInterfaceManager = new GraphicalInterfaceManager();

		// Create an ElectronGraphicalInterface
		var electronGraphicalInterface = new ElectronGraphicalInterface('framework');

		// Add the ElectronGraphicalInterface to the GraphicalInterfaceManager
		app.interfaces.graphicalInterfaceManager.add(electronGraphicalInterface);

		// Show the ElectronGraphicalInterface
		electronGraphicalInterface.show();
	}

	// The main renderer process
	inElectronMainBrowserWindow() {
		console.log('resolve comments below');

		// We are inside of an Electron.BrowserWindow at this point

		// We need to initialize a GraphicalInterface here

		// The app process which created us has a GraphicalInterfaceManager as well as a graphicalInterface which represents us
		// Do we need to get a reference to this same graphicalInterface?

		// How heavy is communication over remote? how does remote work?
		//app.interfaces = electron.remote.app.app;

		// For now, I will just create a new one until I can figure it out
		app.interfaces.graphicalInterfaceManager
	}

	async processCommandProctor() {
		// Create a Proctor to oversee all of the tests as they run
		var proctor = new Proctor(this.interfaces.commandLine.command.subcommands.proctor.options.reporter, this.interfaces.commandLine.command.subcommands.proctor.options.breakOnError);
		//app.log('Proctor created', proctor);
		//return; // Debug

		// If test supervising is enabled
		if(this.interfaces.commandLine.command.subcommands.proctor.options.supervise) {
			proctor.supervise();
		}
		// Get and run the tests
		else {
			// If there is no path set the path to the framework directory
			if(!this.interfaces.commandLine.command.subcommands.proctor.options.path) {
				this.interfaces.commandLine.command.subcommands.proctor.options.path = app.framework.directory;
			}

			//proctor.getAndRunTests(this.interfaces.commandLine.command.subcommands.proctor.options.path, this.interfaces.commandLine.command.subcommands.proctor.options.filePattern, this.interfaces.commandLine.command.subcommands.proctor.options.methodPattern);

			// Debug
			var path = this.interfaces.commandLine.command.subcommands.proctor.options.path;
			var filePattern = this.interfaces.commandLine.command.subcommands.proctor.options.filePattern;
			var methodPattern = this.interfaces.commandLine.command.subcommands.proctor.options.methodPattern;
			
			//path = Node.Path.join(app.framework.directory, 'globals');
			//filePattern = 'Command';
			//methodPattern = '';			
			//app.log('path', path, 'filePattern', filePattern, 'methodPattern', methodPattern);
			
			proctor.getAndRunTests(path, filePattern, methodPattern);
		}
	}

}

// Global instance
global.app = new FrameworkApp(__dirname);

// Initialize
global.app.initialize();

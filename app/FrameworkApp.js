// Globals
import './../globals/Globals.js';
import AsciiArt from './../system/ascii-art/AsciiArt.js';
import Directory from './../system/file-system/Directory.js';
import Proctor from './../system/test/Proctor.js';

// Dependencies
import App from './../system/app/App.js';

// Class
class FrameworkApp extends App {

	async initialize() {
		await super.initialize(...arguments);
		
		// If in the Electron context
		if(app.inElectronContext()) {
			this.initializeGraphicalInterfaceInElectron();
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

	initializeGraphicalInterfaceInElectron() {
		console.warn('Resolve this entire comment:');

		/*
			Not all apps will have a graphicalInterface, will need a graphicalInterfaceManager to manage them as they may have several top level interfaces
				both the Electron.BrowserWindow and the document.window will be represented by an abstract GraphicalInterface graphical interfaces have an identifier

				app.interfaces.graphical = {
					id: GraphicalInterface
				}
				app.interfaces.graphicalInterfaceManager


			App
				Sub Process
					Electron
						ElectronApp - Graphical Interface Manager
							Graphical Interface (Electron.BrowserWindow/window)

			How does ElectronApp talk to App
			How does GraphicalInterface talk to ElectronApp and to App?

			need to create a graphical interface (dom window) which will house our htmldocument
		*/

		app.interfaces.graphicalInterfaceManager = new GraphicalInterfaceManager();
	}

	// TODO: Move this to an ElectronManager class helper function
	async getPathToElectronExecutable() {
		var pathToElectronExecutable = null;

		// Get the electron
		var nodeModuleLookupPaths = Node.Module._resolveLookupPaths('electron')[1];
		var pathToElectronModule = null;
		//app.log('nodeModuleLookupPaths', nodeModuleLookupPaths);

		await nodeModuleLookupPaths.each(async function(index, lookupPath) {
			var reformedLookupPath = lookupPath;
			//app.log('reformedLookupPath', reformedLookupPath);
			if(reformedLookupPath.endsWith('node')) {
				reformedLookupPath = reformedLookupPath.replaceLast('node', 'node_modules');
			}

			reformedLookupPath = Node.Path.join(reformedLookupPath, 'electron');

			if(await Directory.exists(reformedLookupPath)) {
				pathToElectronModule = reformedLookupPath;
				return false; // break
			}
		});

		//app.info('pathToElectronModule', pathToElectronModule);

		if(pathToElectronModule) {
			pathToElectronExecutable = require(pathToElectronModule);
			//app.log('pathToElectronExecutable', pathToElectronExecutable);
		}

		return pathToElectronExecutable;
	}

	async processCommandGraphicalInterface() {
		app.log('Loading graphical interface...');

		var pathToElectronExecutable = await this.getPathToElectronExecutable();		

		var electronChildProcess = Node.spawnChildProcess(pathToElectronExecutable, ['--js-flags="--harmony"', 'app/FrameworkElectronApp.js'], {
			cwd: app.framework.directory,
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

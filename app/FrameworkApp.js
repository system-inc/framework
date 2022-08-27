// Run this script from the command line using index.js or scripts/run.sh
// (until Node no longer needs an experimental loader passed into the command line arguments)
// https://github.com/nodejs/help/issues/2831

// Dependencies
import { App } from '@framework/system/app/App.js';
import { AsciiArt } from '@framework/system/ascii/AsciiArt.js';
import { Proctor } from '@framework/system/test/Proctor.js';

// Class
class FrameworkApp extends App {

	async initializeCommandLineInterface() {
		// Parse the command line arguments
		var command = await super.initializeCommandLineInterface();

		// Graphical interface command
		if(command.subcommands.graphicalInterface) {
			//console.log('command.subcommands.graphicalInterface');
			this.executeSubcommandGraphicalInterface(command.subcommands.graphicalInterface);
		}
		// Proctor command
		else if(command.subcommands.proctor) {
			this.executeSubcommandProctor(command.subcommands.proctor);
		}
		// Interactive command line interface command
		else if(command.subcommands.interactiveCommandLineInterface) {
			// Do nothing, this will leave the user in the interactive command line interface
		}
		// Show help by default
		else if(this.inTerminalEnvironment()) {
			// Fun with ASCII art
			this.standardStreams.output.writeLine("\n"+AsciiArt.framework.version[this.framework.version.toString()]+"\n");
			command.showHelp();
			this.exit();
		}
	}

	async executeSubcommandProctor(proctorSubcommand) {
		// Create a Proctor to oversee all of the tests as they run
		var proctor = new Proctor(proctorSubcommand.options.reporter, proctorSubcommand.options.breakOnError);
		//this.log('Proctor created', proctor);
		//return; // Debug

		// If test supervising is enabled
		if(proctorSubcommand.options.supervise) {
			proctor.supervise();
		}
		// Get and run the tests
		else {
			// If there is no path set the path to the framework directory
			if(!proctorSubcommand.options.path) {
				proctorSubcommand.options.path = app.framework.path;
			}

			//proctor.getAndRunTests(proctorSubcommand.options.path, proctorSubcommand.options.filePattern, proctorSubcommand.options.methodPattern);

			// Debug
			var path = proctorSubcommand.options.path;
			var filePattern = proctorSubcommand.options.filePattern;
			var methodPattern = proctorSubcommand.options.methodPattern;
			//path = Node.Path.join(app.framework.path, 'globals');
			//filePattern = 'Command';
			//methodPattern = '';			
			//this.log('path', path, 'filePattern', filePattern, 'methodPattern', methodPattern);
			
			proctor.getAndRunTests(path, filePattern, methodPattern);
		}
	}

	async executeSubcommandGraphicalInterface() {
		// If we aren't in an Electron context start Electron
		if(!this.modules.electronModule.inElectronEnvironment()) {
			// We must manually start Electron as it will not start automatically
			// as FrameworkApp can be a command line interface or a graphical interface app
			this.modules.electronModule.spawnElectronMainProcess();
		}
	}

	async initializeGraphicalInterface() {
		await super.initializeGraphicalInterface();

		// Load the view controller
		const { FrameworkViewController } = await import('@app/interface/FrameworkViewController.js');
		this.interfaces.graphical.setViewController(new FrameworkViewController());
	}

}

// Instatiate and initialize a global instance of the app
global.app = new FrameworkApp();
global.app.initialize();

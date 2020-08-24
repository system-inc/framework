// Dependencies
import { App } from '@framework/system/app/App.js';
import { AsciiArt } from '@framework/system/ascii-art/AsciiArt.js';
import { Proctor } from '@framework/system/test/Proctor.js';
import { Url } from '@framework/system/web/Url.js';

// Class
class FrameworkApp extends App {

	async initialize() {
		await super.initialize(...arguments);

		// Graphical interface command
		if(this.interfaces.commandLine.command.subcommands.graphicalInterface) {
			//console.log('this.interfaces.commandLine.command.subcommands.graphicalInterface');
			this.processCommandGraphicalInterface();
		}
		// Proctor command
		else if(this.interfaces.commandLine.command.subcommands.proctor) {
			this.processCommandProctor();
		}
		// Interactive command line interface command
		else if(this.interfaces.commandLine.command.subcommands.interactiveCommandLineInterface) {
			// Do nothing, this will leave the user in the interactive command line interface
		}
		// Show help by default
		else if(this.inTerminalContext()) {
			// Fun with ASCII art
			this.standardStreams.output.writeLine("\n"+AsciiArt.framework.version[this.framework.version.toString()]+"\n");
			this.interfaces.commandLine.command.showHelp();
			this.exit();
		}
		else {
			console.info('No command was issued.');
		}
	}

	async processCommandProctor() {
		// Create a Proctor to oversee all of the tests as they run
		var proctor = new Proctor(this.interfaces.commandLine.command.subcommands.proctor.options.reporter, this.interfaces.commandLine.command.subcommands.proctor.options.breakOnError);
		//this.log('Proctor created', proctor);
		//return; // Debug

		// If test supervising is enabled
		if(this.interfaces.commandLine.command.subcommands.proctor.options.supervise) {
			proctor.supervise();
		}
		// Get and run the tests
		else {
			// If there is no path set the path to the framework directory
			if(!this.interfaces.commandLine.command.subcommands.proctor.options.path) {
				this.interfaces.commandLine.command.subcommands.proctor.options.path = app.settings.get('framework.path');
			}

			//proctor.getAndRunTests(this.interfaces.commandLine.command.subcommands.proctor.options.path, this.interfaces.commandLine.command.subcommands.proctor.options.filePattern, this.interfaces.commandLine.command.subcommands.proctor.options.methodPattern);

			// Debug
			var path = this.interfaces.commandLine.command.subcommands.proctor.options.path;
			var filePattern = this.interfaces.commandLine.command.subcommands.proctor.options.filePattern;
			var methodPattern = this.interfaces.commandLine.command.subcommands.proctor.options.methodPattern;
			
			//path = Node.Path.join(app.settings.get('framework.path'), 'globals');
			//filePattern = 'Command';
			//methodPattern = '';			
			//this.log('path', path, 'filePattern', filePattern, 'methodPattern', methodPattern);
			
			proctor.getAndRunTests(path, filePattern, methodPattern);
		}
	}

	async processCommandGraphicalInterface() {
		//console.log('processCommandGraphicalInterface');

		// If we aren't in an Electron context start Electron
		if(!this.modules.electronModule.inElectronContext()) {
			// We must manually start Electron as it will not start automatically as FrameworkApp can be a command line interface or a graphical interface app
			this.modules.electronModule.startElectron();
		}
		// If we are in an Electron renderer process, initialize the graphical interface manager
		else if(this.modules.electronModule.inElectronRendererProcess()) {
			// Load the view controller
			const FrameworkViewController = (await import('interface/FrameworkViewController.js')).default;
			app.interfaces.graphical.setViewController(new FrameworkViewController());
		}
		else {
			//app.info('In the Electron main process, do nothing here as the main process is just used to launch the first renderer process where the app really lives');
		}
	}

}

// Global app instance
global.app = new FrameworkApp(__dirname);
global.app.initialize();

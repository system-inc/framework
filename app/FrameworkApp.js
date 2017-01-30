// Globals
import 'framework/globals/Globals.js';
import AsciiArt from 'framework/system/ascii-art/AsciiArt.js';
import ElectronManager from 'framework/system/interface/graphical/electron/ElectronManager.js';
import ElectronGraphicalInterfaceManager from 'framework/system/interface/graphical/managers/electron/ElectronGraphicalInterfaceManager.js';
import GraphicalInterface from 'framework/system/interface/graphical/GraphicalInterface.js';
import FrameworkViewController from 'interface/FrameworkViewController.js';
import Proctor from 'framework/system/test/Proctor.js';

// Dependencies
import App from 'framework/system/app/App.js';
var Electron = null;

// Class
class FrameworkApp extends App {

	electronMainBrowserWindow = null;
	electronTestBrowserWindows = {};

	async initialize() {
		await super.initialize(...arguments);

		//app.log('hi'); app.exit();

		// Import and configure Electron if in the Electron context
		if(this.inElectronContext()) {
			//console.log('inElectronContext');
			Electron = require('electron');
		}
		
		// If in the Electron main process
		if(this.inElectronMainProcess()) {
			// Enable Harmony fopr any Electron renderer processes we create
			Electron.app.commandLine.appendSwitch('--js-flags', '--harmony');

			//app.log('app.inElectronMainProcess');
			this.electronMainProcess();
		}
		// If in the Electron renderer process
		else if(this.inElectronRendererProcess()) {
			//app.log('app.inElectronRendererProcess');
			this.electronRendererProcess();
		}
		// Proctor command
		else if(this.interfaces.commandLine.command.subcommands.proctor) {
			this.processCommandProctor();
		}
		// Graphical interface command
		else if(this.interfaces.commandLine.command.subcommands.graphicalInterface) {
			//app.log('this.interfaces.commandLine.command.subcommands.graphicalInterface');
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

	async processCommandGraphicalInterface() {
		//app.log('Loading graphical interface...');

		// Get the path to the Electron executable
		var pathToElectronExecutable = await ElectronManager.getPathToElectronExecutable();
		//console.log('pathToElectronExecutable', pathToElectronExecutable);

		// Run Electron as a child process
		var childProcessElectronMainProcess = Node.spawnChildProcess(pathToElectronExecutable, ['--js-flags=--harmony-async-await', 'app/index.js', 'gi'], {});

		// The parent process I am in now exists to just to as a bridge for standard streams to the child process which is the Electron main process

		// So, I remove all listeners from the parent process standard input stream
		Node.Process.stdin.removeAllListeners();

		// And send all standard input to the child process
		Node.Process.stdin.on('data', function(data) {
			childProcessElectronMainProcess.stdin.write(data);
		});

		// Standard out from the child process is bridged to the parent process
		childProcessElectronMainProcess.stdout.on('data', function(data) {
			//app.standardStreams.output.write('(Child Process - Electron Main Process) '+data.toString());
			app.standardStreams.output.write(data);
		});

		// Standard error from the child process is bridged to the parent process
		childProcessElectronMainProcess.stderr.on('data', function(data) {
			//app.standardStreams.error.write('(Child Process - Electron Main Process) '+data.toString());
			app.standardStreams.error.write(data);
		});

		// Kill the parent process when the child process exits
		childProcessElectronMainProcess.on('close', function(code) {
			app.standardStreams.output.writeLine('Child Process - Electron Main Process exited with code '+code+'.');
			app.exit();
		});
	}

	// Electron main process
	electronMainProcess() {
		//console.log('inElectronMainProcess');

		// When the app is activated from the macOS dock
		Electron.app.on('activate', function () {
			// The expected behavior is to create a new window
			if(this.electronMainBrowserWindow === null) {
				this.createElectronMainBrowserWindow();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		Electron.app.on('window-all-closed', function () {
			if(!app.onMacOs()) {
				Electron.app.quit()
			}
		});

		// Create the main browser window
		this.createElectronMainBrowserWindow();

		// electronMainBrowserWindow can tell electronMainProcess to create electronTestBrowserWindows
		Electron.ipcMain.on('electronMainBrowserWindow.createElectronTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, testClassName, testMethodName) {
			this.createElectronTestBrowserWindow(testBrowserWindowUniqueIdentifier, testClassName, testMethodName);
		}.bind(this));

		// electronMainBrowserWindow can tell electronMainProcess to destroy electronTestBrowserWindows
		Electron.ipcMain.on('electronMainBrowserWindow.destroyTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier) {
			this.destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier);
		}.bind(this));

		// electronMainBrowserWindow can tell electronMainProcess to command electronTestBrowserWindows
		Electron.ipcMain.on('electronMainBrowserWindow.commandTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, command, data) {
			this.commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data);
		}.bind(this));

		// electronTestBrowserWindows can tell electronMainProcess to report to the electronMainBrowserWindow
		Electron.ipcMain.on('electronTestBrowserWindow.report', function(event, testBrowserWindowUniqueIdentifier, data) {
			this.electronMainBrowserWindow.send('electronTestBrowserWindow.report', testBrowserWindowUniqueIdentifier, data);
		}.bind(this));
	}

	createElectronMainBrowserWindow() {
		//console.log('FrameworkApp createElectronMainBrowserWindow');

		// TODO: This should all be configured using app settings
		// Create the browser window
		this.electronMainBrowserWindow = new Electron.BrowserWindow({
			//url: app.directory.toString(),
			width: 800,
			height: 600,
			webPreferences: {
				// Load FrameworkApp through the preload mechanism
				//preload: Node.Path.join(app.directory, 'index.js'),
			},
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: true, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Load an empty page, we use the webPreferences preload open to load FrameworkApp
		console.error('Start electron issue on creating a browser window without an html file: Can\'t just use preload script, must specifiy loadurl, cant use about blank, must have an actual html file if I want css files to work probably for relative pathing');
		//this.electronMainBrowserWindow.loadURL('about:blank');
		var appHtmlFilePath = require('url').format({
			protocol: 'file',
			pathname: require('path').join(__dirname, 'index.html'),
			slashes: true,
		});
		this.electronMainBrowserWindow.loadURL(appHtmlFilePath);

		// Debugging - comment out the lines below when ready for release
		this.electronMainBrowserWindow.webContents.openDevTools(); // Comment out for production
		this.electronMainBrowserWindow.show(); // Comment out for production
		
		// When the window is closed
		this.electronMainBrowserWindow.on('closed', function () {
			// Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element
			this.electronMainBrowserWindow = null

			// Quit when the electronMainBrowserWindow is closed
			Electron.app.quit();
		}.bind(this));
	}

	createElectronTestBrowserWindow(testBrowserWindowUniqueIdentifier) {
	    var testBrowserWindow = this.electronTestBrowserWindows[testBrowserWindowUniqueIdentifier] = new Electron.BrowserWindow({
	        title: testBrowserWindowUniqueIdentifier,
	        show: false,
	    });

	    // Show developer tools on failure
	    // TODO: Don't show dev tools always
	    //testBrowserWindow.openDevTools();

	    // Load the test method container page, passing in the testBrowserWindowUniqueIdentifier as the hash
		var testBrowserWindowUrl = require('url').format({
			protocol: 'file',
			pathname: __dirname+'/proctor/browser-windows/test-browser-window/TestBrowserWindow.html',
			slashes: true,
			hash: testBrowserWindowUniqueIdentifier,
		});
	    testBrowserWindow.loadURL(testBrowserWindowUrl);

	    // Clean up when the testBrowserWindow closes
	    testBrowserWindow.on('closed', function(event) {
	    	this.testBrowserWindowClosed(testBrowserWindowUniqueIdentifier);
	    }.bind(this));
	}

	destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier) {
		this.electronTestBrowserWindows[testBrowserWindowUniqueIdentifier].destroy();
	}

	testBrowserWindowClosed(testBrowserWindowUniqueIdentifier) {
		//console.log('Deleting reference to testBrowserWindow', testBrowserWindowUniqueIdentifier);

		// Remove the reference from this.electronTestBrowserWindows
		delete this.electronTestBrowserWindows[testBrowserWindowUniqueIdentifier];

		// Notify the electronMainbrowserWindow if it is still active
		if(this.electronMainBrowserWindow) {
			this.electronMainBrowserWindow.send('electronTestBrowserWindow.report', {
				status: 'testBrowserWindowClosed',
				testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
			});
		}
	}

	commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data) {
		// If the test browser window exists
		if(this.electronTestBrowserWindows[testBrowserWindowUniqueIdentifier]) {
			this.electronTestBrowserWindows[testBrowserWindowUniqueIdentifier].send('electronMainBrowserWindow.commandTestBrowserWindow', command, data);	
		}
	}

	// Electron renderer process
	electronRendererProcess() {
		console.log('inElectronRendererProcess');

		console.log('resolve comments below');

		// We are inside of an Electron.BrowserWindow at this point

		// We need to initialize a GraphicalInterface here

		// The app process which created us has a GraphicalInterfaceManager as well as a graphicalInterface which represents us
		// Do we need to get a reference to this same graphicalInterface?

		// How heavy is communication over remote? how does remote work?
		//app.interfaces = electron.remote.app.app;

		// For now, I will just create a new one until I can figure it out

		//var Electron = require('electron');
		//app.interfaces.graphicalInterfaceManager = Electron.remote.app.interfaces.graphicalInterfaceManager;

		// TODO: Replace global app with the main Electron process app property?
		//global.app = Electron.remote.getGlobal('app');

		/*

			Step 1 - Get a reference to app
				There should only be one app, so we should probably rely on the app global from the main process:
				global.app = Electron.remote.getGlobal('app');

			Step 2 - Get a reference to the graphicalInterface that represents the renderer process
				var currentGraphicalInterface = app.interfaces.graphicalInterface.getCurrentGraphicalInterface();
					this is similar to Electron.remote.getCurrentWindow();

			Step 3 - Initialize the graphical interface

			app
				interfaces
					graphical interface (this abstracts ElectronBrowserWindow, domwindow, and htmldocument)
						view controller
	
				var viewController = new ViewController();
				currentGraphicalInterface.initialize(viewController);
		*/

		// Create a graphical interface manager, in this case, ElectronGraphicalInterfaceManager
		app.interfaces.graphicalInterfaceManager = new ElectronGraphicalInterfaceManager();

		// Have the graphical interface manager create a graphical interface with a view controller
		app.interfaces.graphicalInterfaceManager.create(new FrameworkViewController());
	}

}

// Global instance
global.app = new FrameworkApp(__dirname);

// Initialize
global.app.initialize();

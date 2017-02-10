// Globals
import 'framework/globals/Globals.js';
import AsciiArt from 'framework/system/ascii-art/AsciiArt.js';
import Proctor from 'framework/system/test/Proctor.js';

// Dependencies
import App from 'framework/system/app/App.js';
var Electron = null;

// Class
class FrameworkApp extends App {

	mainBrowserWindow = null;
	testBrowserWindows = {};

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
			this.contextIsElectronMainProcess();
		}
		// If in the Electron renderer process
		else if(this.inElectronRendererProcess()) {
			//app.log('app.inElectronRendererProcess', 'window.location.hash', window.location.hash);
			
			if(window.location.hash.startsWith('#testBrowserWindow-')) {
				//console.log('IN electron test browser window!');
				this.contextIsTestBrowserWindowRendererProcess();
			}
			else {
				this.contextIsMainBrowserWindowRendererProcess();	
			}
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
		var ElectronManager = require('framework/system/interface/graphical/electron/ElectronManager.js').default;

		// Get the path to the Electron executable
		var pathToElectronExecutable = await ElectronManager.getPathToElectronExecutable();
		//console.log('pathToElectronExecutable', pathToElectronExecutable);

		// Run Electron as a child process
		console.error('When I open index.js i get stdio but must specify js flags async-await. I should be doing the thing on the line below but it breaks stdio');
		var childProcessElectronMainProcess = Node.spawnChildProcess(pathToElectronExecutable, ['--js-flags=--harmony-async-await', 'app/index.js', 'gi'], {});
		//var childProcessElectronMainProcess = Node.spawnChildProcess(pathToElectronExecutable, ['--js-flags=--harmony', 'app/index.html', 'gi'], {});

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
	contextIsElectronMainProcess() {
		//console.log('inElectronMainProcess');

		// When the app is activated from the macOS dock
		Electron.app.on('activate', function () {
			// The expected behavior is to create a new window
			if(this.mainBrowserWindow === null) {
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

		// mainBrowserWindow can tell electronMainProcess to create testBrowserWindows
		Electron.ipcMain.on('mainBrowserWindow.createTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, testClassName, testMethodName) {
			//app.log('mainBrowserWindow.createTestBrowserWindow', event, testBrowserWindowUniqueIdentifier, testClassName, testMethodName);
			this.createTestBrowserWindow(testBrowserWindowUniqueIdentifier, testClassName, testMethodName);
		}.bind(this));

		// mainBrowserWindow can tell electronMainProcess to destroy testBrowserWindows
		Electron.ipcMain.on('mainBrowserWindow.destroyTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier) {
			this.destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier);
		}.bind(this));

		// mainBrowserWindow can tell electronMainProcess to command testBrowserWindows
		Electron.ipcMain.on('mainBrowserWindow.commandTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, command, data) {
			this.commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data);
		}.bind(this));

		// testBrowserWindows can tell electronMainProcess to report to the mainBrowserWindow
		Electron.ipcMain.on('testBrowserWindow.report', function(event, testBrowserWindowUniqueIdentifier, data) {
			//console.log('testBrowserWindow.report', ...arguments);
			this.mainBrowserWindow.send('testBrowserWindow.report', testBrowserWindowUniqueIdentifier, data);
		}.bind(this));
	}

	// Electron renderer process
	contextIsMainBrowserWindowRendererProcess() {
		//console.log('inElectronRendererProcess');

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
		var ElectronGraphicalInterfaceManager = require('framework/system/interface/graphical/managers/electron/ElectronGraphicalInterfaceManager.js').default;
		app.interfaces.graphicalInterfaceManager = new ElectronGraphicalInterfaceManager();

		var FrameworkViewController = require('interface/FrameworkViewController.js').default;

		// Have the graphical interface manager create a graphical interface with a view controller
		app.interfaces.graphicalInterfaceManager.create(new FrameworkViewController());
	}

	createElectronMainBrowserWindow() {
		//console.log('FrameworkApp createElectronMainBrowserWindow');

		// TODO: This should all be configured using app settings
		// Create the browser window
		this.mainBrowserWindow = new Electron.BrowserWindow({
			//url: app.directory.toString(),
			width: 800,
			height: 600,
			webPreferences: {
				// Load FrameworkApp through the preload mechanism
				//preload: Node.Path.join(app.directory, 'index.js'),
			},
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			//show: true, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Load an empty page, we use the webPreferences preload open to load FrameworkApp
		console.error('Start electron issue on creating a browser window without an html file: Can\'t just use preload script, must specifiy loadurl, cant use about blank, must have an actual html file if I want css files to work probably for relative pathing');
		//this.mainBrowserWindow.loadURL('about:blank');
		var appHtmlFilePath = require('url').format({
			protocol: 'file',
			pathname: Node.Path.join(app.directory, 'index.html'),
			slashes: true,
		});
		this.mainBrowserWindow.loadURL(appHtmlFilePath);

		// Debugging - comment out the lines below when ready for release
		this.mainBrowserWindow.webContents.openDevTools(); // Comment out for production
		this.mainBrowserWindow.show(); // Comment out for production
		
		// When the window is closed
		this.mainBrowserWindow.on('closed', function () {
			// Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element
			this.mainBrowserWindow = null

			// Quit when the mainBrowserWindow is closed
			Electron.app.quit();
		}.bind(this));
	}

	createTestBrowserWindow(testBrowserWindowUniqueIdentifier) {
		//app.log('createTestBrowserWindow', testBrowserWindowUniqueIdentifier);

	    var testBrowserWindow = this.testBrowserWindows[testBrowserWindowUniqueIdentifier] = new Electron.BrowserWindow({
	        title: testBrowserWindowUniqueIdentifier,
	        //show: false,
	    });

	    // Show developer tools on failure
	    // TODO: Don't show dev tools always
	    testBrowserWindow.openDevTools();

	    // Load the test method container page, passing in the testBrowserWindowUniqueIdentifier as the hash
		var testBrowserWindowUrl = require('url').format({
			protocol: 'file',
			pathname: Node.Path.join(app.directory, 'index.html'),
			slashes: true,
			hash: 'testBrowserWindow-'+testBrowserWindowUniqueIdentifier,
		});
	    testBrowserWindow.loadURL(testBrowserWindowUrl);

	    // Clean up when the testBrowserWindow closes
	    testBrowserWindow.on('closed', function(event) {
	    	//console.log('closed!');
	    	this.testBrowserWindowClosed(testBrowserWindowUniqueIdentifier);
	    }.bind(this));
	}

	contextIsTestBrowserWindowRendererProcess() {
        // Set the testBrowserWindowUniqueIdentifier - must use window. as we do not have an HtmlDocument object
        var testBrowserWindowUniqueIdentifier = window.location.hash.replace('#testBrowserWindow-', '');
        //app.log('testBrowserWindowUniqueIdentifier', testBrowserWindowUniqueIdentifier);

        // Handle commands from the mainBrowserWindow
        Electron.ipcRenderer.on('mainBrowserWindow.commandTestBrowserWindow', function(eventFromIpcMain, command, data) {
            //console.log(command, data);

            // runTestMethod
            if(command == 'runTestMethod') {
                var testClassFilePath = data.testClassFilePath;
                var testClassName = data.testClassName;
                var testMethodName = data.testMethodName;

                // Set the page title - must use document. as we do not have an HtmlDocument object
                document.title = testClassName+'.'+testMethodName+' \u2022 Tests \u2022 Testing \u2022 Framework';

                var proctor = new Proctor('electron', true);

                var proctorEvents = [
                    //'Proctor.startedRunningTests',
                    //'Proctor.startedRunningTest',
                    'Proctor.startedRunningTestMethod',
                    'Proctor.finishedRunningTestMethod',
                    //'Proctor.finishedRunningTest',
                    'Proctor.finishedRunningTests',
                ];

                proctorEvents.each(function(proctorEventIndex, proctorEvent) {
                    proctor.on(proctorEvent, function(event) {
                    	//console.log(event);

                    	// Log errors
                    	if(event.identifier === 'Proctor.finishedRunningTestMethod') {
	                    	var error = event.getValueByPath('data.failedTestMethods.0.error');
	                    	if(error) {
	                    		console.error(error.toString());
	                    	}
                    	}

                        Electron.ipcRenderer.send('testBrowserWindow.report', {
                            status: proctorEvent,
                            data: event.data,
                            testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
                        });
                    });
                });

                //app.log('Testing below');
                proctor.getAndRunTestMethod(testClassFilePath, testClassName, testMethodName);
            }
            // close
            else if(command == 'close') {
                Electron.remote.getCurrentWindow().close();
            }
            // reset
            else if(command == 'reset') {
                document.location.reload(true);
            }
            // openDeveloperTools
            else if(command == 'openDeveloperTools') {
                Electron.remote.getCurrentWindow().openDevTools();
            }
            // show
            else if(command == 'show') {
                Electron.remote.getCurrentWindow().show();
            }
        });

        // Report we are ready
        Electron.ipcRenderer.send('testBrowserWindow.report', {
            status: 'readyForCommand',
            testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
        });
	}

	destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier) {
		this.testBrowserWindows[testBrowserWindowUniqueIdentifier].destroy();
	}

	testBrowserWindowClosed(testBrowserWindowUniqueIdentifier) {
		//console.log('Deleting reference to testBrowserWindow', testBrowserWindowUniqueIdentifier);

		// Remove the reference from this.testBrowserWindows
		if(this.testBrowserWindows[testBrowserWindowUniqueIdentifier]) {
			delete this.testBrowserWindows[testBrowserWindowUniqueIdentifier];
		}

		// Notify the electronMainbrowserWindow if it is still active
		if(this.mainBrowserWindow) {
			this.mainBrowserWindow.send('testBrowserWindow.report', {
				status: 'testBrowserWindowClosed',
				testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
			});
		}
	}

	commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data) {
		// If the test browser window exists
		if(this.testBrowserWindows[testBrowserWindowUniqueIdentifier]) {
			this.testBrowserWindows[testBrowserWindowUniqueIdentifier].send('mainBrowserWindow.commandTestBrowserWindow', command, data);	
		}
	}

}

// Global instance
global.app = new FrameworkApp(__dirname);

// Initialize
global.app.initialize();

//TODO: 7.0.0 means when Node 7.0.0 comes out in Electron
// 7.0.0: All of this code will move to FrameworkApp.initializeGraphicalInterfaceInElectron or probably ElectronManager or something

// Dependencies
var Electron = require('electron');

global.app = 'app global test';

// 7.0.0: This will be app.directory, won't even need this variable
var appScriptFilePath = require('path').join(__dirname, 'index.js');

// Class
class FrameworkElectronApp {

	constructor() {
		// Keep a reference to the main browser window, if you don't, the window will be closed automatically when the object is garbage collected
		this.mainBrowserWindow = null;
		this.testBrowserWindows = {};

		Electron.app.commandLine.appendSwitch('--js-flags', '--harmony');

		this.listen();
	}

	listen() {
		console.log('Listening...');

		// Capture the standard stream input data
		process.stdin.on('data', function(data) {
			console.log('Standard input data:', data);

			// Ctrl-c
			if(data == '\u0003') {
				console.log('Exiting by user request...');
				process.exit();
			}
		}.bind(this));

		// When the app is ready, create the main browser window
		Electron.app.on('ready', this.createMainBrowserWindow.bind(this));

		// When the app is activated from the macOS dock
		Electron.app.on('activate', function () {
			// The expected behavior is to create a new window
			if(this.mainBrowserWindow === null) {
				this.createMainBrowserWindow();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		Electron.app.on('window-all-closed', function () {
			if(process.platform !== 'darwin') {
				Electron.app.quit()
			}
		});

		// mainBrowserWindow can tell Application to create testBrowserWindows
		Electron.ipcMain.on('mainBrowserWindow.createTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, testClassName, testMethodName) {
			this.createTestBrowserWindow(testBrowserWindowUniqueIdentifier, testClassName, testMethodName);
		}.bind(this));

		// mainBrowserWindow can tell Application to destory testBrowserWindows
		Electron.ipcMain.on('mainBrowserWindow.destroyTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier) {
			this.destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier);
		}.bind(this));

		// mainBrowserWindow can tell Application to command testBrowserWindows
		Electron.ipcMain.on('mainBrowserWindow.commandTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, command, data) {
			this.commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data);
		}.bind(this));

		// testBrowserWindows can tell Application to report to the mainBrowserWindow
		Electron.ipcMain.on('testBrowserWindow.report', function(event, testBrowserWindowUniqueIdentifier, data) {
			this.mainBrowserWindow.send('testBrowserWindow.report', testBrowserWindowUniqueIdentifier, data);
		}.bind(this));
	}

	createMainBrowserWindow() {
		console.log('FrameworkElectronApp createMainBrowserWindow');

		Electron.app.test = 'hi';

		// 7.0.0: This should all be configured using app settings
		// Create the browser window
		this.mainBrowserWindow = new Electron.BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				// Load FrameworkApp through the preload mechanism
				preload: appScriptFilePath,
			},
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: true, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Debugging - comment out the lines below when ready for release
		this.mainBrowserWindow.webContents.openDevTools(); // Comment out for production
		this.mainBrowserWindow.show(); // Comment out for production

		// Load an empty page, we use the webPreferences preload open to load FrameworkApp
		this.mainBrowserWindow.loadURL('about:blank');
		
		// When the window is closed
		this.mainBrowserWindow.on('closed', function () {
			// Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element
			this.mainBrowserWindow = null

			// Quit when the mainBrowserWindow is closed
			Electron.app.quit();
		}.bind(this));
	}

	createTestBrowserWindow(testBrowserWindowUniqueIdentifier) {
	    var testBrowserWindow = this.testBrowserWindows[testBrowserWindowUniqueIdentifier] = new Electron.BrowserWindow({
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
		this.testBrowserWindows[testBrowserWindowUniqueIdentifier].destroy();
	}

	testBrowserWindowClosed(testBrowserWindowUniqueIdentifier) {
		//console.log('Deleting reference to testBrowserWindow', testBrowserWindowUniqueIdentifier);

		// Remove the reference from this.testBrowserWindows
		delete this.testBrowserWindows[testBrowserWindowUniqueIdentifier];

		// Notify the mainBrowserWindow if it is still active
		if(this.mainBrowserWindow) {
			this.mainBrowserWindow.send('this.report', {
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
global.frameworkElectronApp = new FrameworkElectronApp();

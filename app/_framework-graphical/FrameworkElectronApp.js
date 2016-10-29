// Dependencies
var Electron = require('electron');

// Enable async and await
Electron.app.commandLine.appendSwitch('--js-flags', '--harmony-async-await');

// Class
var ElectronApplication = {};

// Static properties

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the object is garbage collected
ElectronApplication.mainBrowserWindow = null;
ElectronApplication.testBrowserWindows = {};

// Static methods

ElectronApplication.run = function() {
	// This method will be called when Electron has done all initialization and is ready to create browser windows
	Electron.app.on('ready', function() {
		// Create the browser window
		ElectronApplication.mainBrowserWindow = new Electron.BrowserWindow({
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: true, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Debugging - comment out the lines below when ready for release
		ElectronApplication.mainBrowserWindow.openDevTools(); // Comment out for production
		ElectronApplication.mainBrowserWindow.show(); // Comment out for production

		// Load the main browser window content
		ElectronApplication.mainBrowserWindow.loadURL('file://'+__dirname+'/ElectronApp.html');
		//ElectronApplication.mainBrowserWindow.loadURL('https://kangax.github.io/compat-table/es6/');

		// When the window is closed
		ElectronApplication.mainBrowserWindow.on('closed', function() {
			// Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element
			ElectronApplication.mainBrowserWindow = null;

			// Quit when the mainBrowserWindow is closed
			Electron.app.quit();
		});
	});

	// Quit when all windows are closed
	Electron.app.on('window-all-closed', function() {
		Electron.app.quit();
	});

	// mainBrowserWindow can tell Application to create testBrowserWindows
	Electron.ipcMain.on('mainBrowserWindow.createTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, testClassName, testMethodName) {
		ElectronApplication.createTestBrowserWindow(testBrowserWindowUniqueIdentifier, testClassName, testMethodName);
	});

	// mainBrowserWindow can tell Application to destory testBrowserWindows
	Electron.ipcMain.on('mainBrowserWindow.destroyTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier) {
		ElectronApplication.destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier);
	});

	// mainBrowserWindow can tell Application to command testBrowserWindows
	Electron.ipcMain.on('mainBrowserWindow.commandTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, command, data) {
		ElectronApplication.commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data);
	});

	// testBrowserWindows can tell Application to report to the mainBrowserWindow
	Electron.ipcMain.on('testBrowserWindow.report', function(event, testBrowserWindowUniqueIdentifier, data) {
		ElectronApplication.mainBrowserWindow.send('testBrowserWindow.report', testBrowserWindowUniqueIdentifier, data);
	});
};

ElectronApplication.createTestBrowserWindow = function(testBrowserWindowUniqueIdentifier) {
    var testBrowserWindow = ElectronApplication.testBrowserWindows[testBrowserWindowUniqueIdentifier] = new Electron.BrowserWindow({
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
    	ElectronApplication.testBrowserWindowClosed(testBrowserWindowUniqueIdentifier);
    });
};

ElectronApplication.destroyTestBrowserWindow = function(testBrowserWindowUniqueIdentifier) {
	ElectronApplication.testBrowserWindows[testBrowserWindowUniqueIdentifier].destroy();
};

ElectronApplication.testBrowserWindowClosed = function(testBrowserWindowUniqueIdentifier) {
	//console.log('Deleting reference to testBrowserWindow', testBrowserWindowUniqueIdentifier);

	// Remove the reference from ElectronApplication.testBrowserWindows
	delete ElectronApplication.testBrowserWindows[testBrowserWindowUniqueIdentifier];

	// Notify the mainBrowserWindow if it is still active
	if(ElectronApplication.mainBrowserWindow) {
		ElectronApplication.mainBrowserWindow.send('ElectronApplication.report', {
			status: 'testBrowserWindowClosed',
			testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
		});	
	}
};

ElectronApplication.commandTestBrowserWindow = function(testBrowserWindowUniqueIdentifier, command, data) {
	// If the test browser window exists
	if(ElectronApplication.testBrowserWindows[testBrowserWindowUniqueIdentifier]) {
		ElectronApplication.testBrowserWindows[testBrowserWindowUniqueIdentifier].send('mainBrowserWindow.commandTestBrowserWindow', command, data);	
	}
};

// Run the application
ElectronApplication.run();

// Export
module.exports = ElectronApplication;
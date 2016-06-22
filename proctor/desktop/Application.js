// Dependencies
var Electron = require('electron');

// Class
var Application = {};

// Static properties

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the object is garbage collected
Application.mainBrowserWindow = null;
Application.testBrowserWindows = {};

// Static methods

Application.run = function() {
	// This method will be called when Electron has done all initialization and is ready to create browser windows
	Electron.app.on('ready', function() {
		// Create the browser window
		Application.mainBrowserWindow = new Electron.BrowserWindow({
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: true, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Debugging - comment out the lines below when ready for release
		Application.mainBrowserWindow.openDevTools(); // Comment out for production
		Application.mainBrowserWindow.show(); // Comment out for production

		// Load the main browser window content
		Application.mainBrowserWindow.loadURL('file://'+__dirname+'/Project.html');
		//Application.mainBrowserWindow.loadURL('https://kangax.github.io/compat-table/es6/');

		// When the window is closed
		Application.mainBrowserWindow.on('closed', function() {
			// Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element
			Application.mainBrowserWindow = null;

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
		Application.createTestBrowserWindow(testBrowserWindowUniqueIdentifier, testClassName, testMethodName);
	});

	// mainBrowserWindow can tell Application to destory testBrowserWindows
	Electron.ipcMain.on('mainBrowserWindow.destroyTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier) {
		Application.destroyTestBrowserWindow(testBrowserWindowUniqueIdentifier);
	});

	// mainBrowserWindow can tell Application to command testBrowserWindows
	Electron.ipcMain.on('mainBrowserWindow.commandTestBrowserWindow', function(event, testBrowserWindowUniqueIdentifier, command, data) {
		Application.commandTestBrowserWindow(testBrowserWindowUniqueIdentifier, command, data);
	});

	// testBrowserWindows can tell Application to report to the mainBrowserWindow
	Electron.ipcMain.on('testBrowserWindow.report', function(event, testBrowserWindowUniqueIdentifier, data) {
		Application.mainBrowserWindow.send('testBrowserWindow.report', testBrowserWindowUniqueIdentifier, data);
	});
};

Application.createTestBrowserWindow = function(testBrowserWindowUniqueIdentifier) {
    var testBrowserWindow = Application.testBrowserWindows[testBrowserWindowUniqueIdentifier] = new Electron.BrowserWindow({
        title: testBrowserWindowUniqueIdentifier,
        show: false,
    });

    // Show developer tools on failure
    // TODO: Don't show dev tools always
    //testBrowserWindow.openDevTools();

    // Load the test method container page, passing in the testBrowserWindowUniqueIdentifier as the hash
	var testBrowserWindowUrl = require('url').format({
		protocol: 'file',
		pathname: __dirname+'/browser-windows/test-browser-window/TestBrowserWindow.html',
		slashes: true,
		hash: testBrowserWindowUniqueIdentifier,
	});
    testBrowserWindow.loadURL(testBrowserWindowUrl);

    // Clean up when the testBrowserWindow closes
    testBrowserWindow.on('closed', function(event) {
    	Application.testBrowserWindowClosed(testBrowserWindowUniqueIdentifier);
    });
};

Application.destroyTestBrowserWindow = function(testBrowserWindowUniqueIdentifier) {
	Application.testBrowserWindows[testBrowserWindowUniqueIdentifier].destroy();
};

Application.testBrowserWindowClosed = function(testBrowserWindowUniqueIdentifier) {
	//console.log('Deleting reference to testBrowserWindow', testBrowserWindowUniqueIdentifier);

	// Remove the reference from Application.testBrowserWindows
	delete Application.testBrowserWindows[testBrowserWindowUniqueIdentifier];

	// Notify the mainBrowserWindow if it is still active
	if(Application.mainBrowserWindow) {
		Application.mainBrowserWindow.send('Application.report', {
			status: 'testBrowserWindowClosed',
			testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
		});	
	}
};

Application.commandTestBrowserWindow = function(testBrowserWindowUniqueIdentifier, command, data) {
	// If the test browser window exists
	if(Application.testBrowserWindows[testBrowserWindowUniqueIdentifier]) {
		Application.testBrowserWindows[testBrowserWindowUniqueIdentifier].send('mainBrowserWindow.commandTestBrowserWindow', command, data);	
	}
};

// Run the application
Application.run();

// Export
module.exports = Application;
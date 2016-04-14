// Dependencies
var BrowserWindow = require('browser-window');

// Class
var Application = require('app');

// Static properties

// Keep a global reference of the window object, if you don't, the window will be closed automatically when the object is garbage collected
Application.mainBrowserWindow = null;
Application.testBrowserWindow = null;
Application.eventEmitter = new (require('events'))();

// Static methods

Application.run = function() {
	// This method will be called when Electron has done all initialization and is ready to create browser windows
	Application.on('ready', function() {
		// Create the browser window
		Application.mainBrowserWindow = new BrowserWindow({
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: true, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Debugging - comment out the lines below when ready for release
		//Application.mainBrowserWindow.openDevTools(); // Comment out for production
		Application.mainBrowserWindow.show(); // Comment out for production

		// Load the main browser window content
		Application.mainBrowserWindow.loadURL('file://'+__dirname+'/Project.html');

		// When the window is closed
		Application.mainBrowserWindow.on('closed', function() {
			// Dereference the window object, usually you would store windows in an array if your app supports multi windows, this is the time when you should delete the corresponding element
			Application.mainBrowserWindow = null;

			if(Application.testBrowserWindow) {
				Application.testBrowserWindow.close();	
			}
			Application.testBrowserWindow = null;			
		});
	});

	// Quit when all windows are closed
	Application.on('window-all-closed', function() {
		Application.quit();
	});
};

Application.runTests = function(path, filePattern, methodPattern) {
	if(!Application.testBrowserWindow) {
		// Create the browser window
		Application.testBrowserWindow = new BrowserWindow({
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			//show: false, // Do not show the main browser window as we want to wait until it is resized before showing it
		});

		// Debugging - comment out the lines below when ready for release
		Application.testBrowserWindow.openDevTools(); // Comment out for production
		//Application.testBrowserWindow.show(); // Comment out for production

		Application.testBrowserWindow.webContents.on('did-finish-load', function() {
			Application.eventEmitter.emit('proctor.getAndRunTests', {
				path: path,
				filePattern: filePattern,
				methodPattern: methodPattern,
			});
		});
	}

	// Load the main browser window content
	Application.testBrowserWindow.loadURL('file://'+__dirname+'/Test.html');
};

// Run the application
Application.run();

// Export
module.exports = Application;
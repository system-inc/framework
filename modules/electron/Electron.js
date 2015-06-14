ElectronClass = Module.extend({

	remote: null,
	screen: null,
	mainBrowserWindow: null,
	mainBrowserWindowState: null,

	initialize: function() {
		// Remotely access Application variables in this renderer process
		this.remote = require('remote');

		// Set the screen
		this.screen = require('screen');

		// Set the main browser window
		this.mainBrowserWindow = this.remote.getCurrentWindow();

		// Set the Project title
		this.mainBrowserWindow.setTitle(Project.title);

		// Initialize the developer tools
		this.initializeDeveloperTools();

		// Initialize the window state
		this.initializeWindowState();

		// Show the main browser window
		this.mainBrowserWindow.show();
	},

	initializeDeveloperTools: function() {
		// Handle developer tools settings
		var developerToolsSettings = ElectronModule.settings.get('mainBrowserWindow.developerTools');

		// Show the developer tools
		if(developerToolsSettings.show) {
			// Open the developer tools
			this.mainBrowserWindow.openDevTools();	
		}
	},

	initializeWindowState: function() {
		// Get the window state settings
		var windowStateSettings = ElectronModule.settings.get('mainBrowserWindow.windowState');

		// Create a window state for the main browser window
		this.mainBrowserWindowState = new WindowState('main', this.mainBrowserWindow, windowStateSettings);
	},

});

// Initialize the module
Electron = new ElectronClass();
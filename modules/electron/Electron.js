ElectronClass = Module.extend({

	remote: null,
	application: null,
	shell: null,
	screen: null,
	menu: null,
	menuItem: null,
	mainBrowserWindow: null,
	mainBrowserWindowState: null,

	initialize: function() {
		// Remotely access Application variables in this renderer process
		this.remote = require('remote');

		// Set the application
		this.application = this.remote.require('app');

		// Set the shell
		this.shell = this.remote.require('shell');

		// Set the menu
		this.menu = this.remote.require('menu');
		this.menuItem = this.remote.require('menu-item');
		this.menu.setApplicationMenu(this.getDefaultMenu());

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

		// Load the initial HtmlDocument
		Controller.getController('Main').main().apply();
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

	getDefaultMenu: function() {
		var menu = this.menu.buildFromTemplate(this.getDefaultMenuTemplate());

		return menu;
	},

	getDefaultMenuTemplate: function() {
		var template = null;

		// If on OS X
		if(process.platform == 'darwin') {
			template = [
				{
					label: Project.title,
					submenu: [
						{
							label: 'About '+Project.title,
							selector: 'orderFrontStandardAboutPanel:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Services',
							submenu: []
						},
						{
							type: 'separator'
						},
						{
							label: 'Hide '+Project.title,
							accelerator: 'Command+H',
							selector: 'hide:'
						},
						{
							label: 'Hide Others',
							accelerator: 'Command+Shift+H',
							selector: 'hideOtherApplications:'
						},
						{
							label: 'Show All',
							selector: 'unhideAllApplications:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Quit',
							accelerator: 'Command+Q',
							click: function() {
								this.application.quit();
							}.bind(this)
						},
					]
				},
				{
					label: 'Edit',
					submenu: [
						{
							label: 'Undo',
							accelerator: 'Command+Z',
							selector: 'undo:'
						},
						{
							label: 'Redo',
							accelerator: 'Shift+Command+Z',
							selector: 'redo:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Cut',
							accelerator: 'Command+X',
							selector: 'cut:'
						},
						{
							label: 'Copy',
							accelerator: 'Command+C',
							selector: 'copy:'
						},
						{
							label: 'Paste',
							accelerator: 'Command+V',
							selector: 'paste:'
						},
						{
							label: 'Select All',
							accelerator: 'Command+A',
							selector: 'selectAll:'
						},
					]
				},
				{
					label: 'View',
					submenu: [
						{
							label: 'Reload',
							accelerator: 'Command+R',
							click: function() {
								var browserWindow = this.remote.require('browser-window');
								var focusedWindow = browserWindow.getFocusedWindow();
								if(focusedWindow) {
									focusedWindow.reload();
								}
							}.bind(this),
						},
						{
							label: 'Toggle Full Screen',
							accelerator: 'Ctrl+Command+F',
							click: function() {
								var browserWindow = this.remote.require('browser-window');
								var focusedWindow = browserWindow.getFocusedWindow();
								if(focusedWindow) {
									focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
								}
							}.bind(this),
						},
						{
							label: 'Toggle Developer Tools',
							accelerator: 'Alt+Command+I',
							click: function() {
								var browserWindow = this.remote.require('browser-window');
								var focusedWindow = browserWindow.getFocusedWindow();
								if(focusedWindow) {
									focusedWindow.toggleDevTools();
								}
							}.bind(this),
						},
					]
				},
				{
					label: 'Window',
					submenu: [
						{
							label: 'Minimize',
							accelerator: 'Command+M',
							selector: 'performMiniaturize:'
						},
						{
							label: 'Close',
							accelerator: 'Command+W',
							selector: 'performClose:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Bring All to Front',
							selector: 'arrangeInFront:'
						},
					]
				},
				//{
				//	label: 'Help',
				//	submenu: [
				//		{
				//			label: Project.title+' Help',
				//			click: function() {
				//				this.shell.openExternal('http://www.google.com/');
				//			}.bind(this),
				//		},
				//	]
				//},
			];
		}
		// Not on OS X
		else {
			template = [
				{
					label: '&File',
					submenu: [
						{
							label: '&Open',
							accelerator: 'Ctrl+O',
						},
						{
							label: '&Close',
							accelerator: 'Ctrl+W',
							click: function() {
								var focusedWindow = this.mainBrowserWindow.getFocusedWindow();
								if(focusedWindow)
									focusedWindow.close();
							}.bind(this),
						},
					]
				},
				{
					label: '&View',
					submenu: [
						{
							label: '&Reload',
							accelerator: 'Ctrl+R',
							click: function() {
								var focusedWindow = this.mainBrowserWindow.getFocusedWindow();
								if(focusedWindow)
									focusedWindow.reload();
							}.bind(this),
						},
						{
							label: 'Toggle &Full Screen',
							accelerator: 'F11',
							click: function() {
								var focusedWindow = this.mainBrowserWindow.getFocusedWindow();
								if(focusedWindow)
									focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
							}.bind(this),
						},
						{
							label: 'Toggle &Developer Tools',
							accelerator: 'Alt+Ctrl+I',
							click: function() {
								var focusedWindow = this.mainBrowserWindow.getFocusedWindow();
								if(focusedWindow)
									focusedWindow.toggleDevTools();
							}.bind(this),
						},
					]
				},
				//{
				//	label: 'Help',
				//	submenu: [
				//		{
				//			label: Project.title+' Help',
				//			click: function() {
				//				this.shell.openExternal('http://www.google.com/');
				//			}.bind(this),
				//		},
				//	]
				//},
			];
		}

		return template;
	},

});

// Initialize the module
Electron = new ElectronClass();
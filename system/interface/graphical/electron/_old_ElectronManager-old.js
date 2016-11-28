// Dependencies
var Electron = Node.require('electron');
var BrowserWindowState = Framework.require('framework/system/electron/BrowserWindowState.js');

// Class
var ElectronManager = Class.extend({

	mainBrowserWindow: null,
	mainBrowserWindowState: null,
	mainBrowserWindowViewController: null,

	initialize: function*() {
		// Do nothing if Electron is not active (e.g., we are running a Framework app that uses Electron but from the console so there is no Electron window)
		if(!Node.Process.versions.electron) {
			app.warn('Electron is disabled. No Electron application code will be executed.');
			return;
		}

		// Set the application menu
		Electron.remote.Menu.setApplicationMenu(this.getDefaultMenu());

		// Remove all screen event listeners to prevent duplicate listeners from being attached on browser window refresh
		Electron.remote.screen.removeAllListeners();

		// Set the main browser window
		this.mainBrowserWindow = Electron.remote.getCurrentWindow();

		// Set the app title
		this.mainBrowserWindow.setTitle(app.title);

		// Initialize the window state
		this.initializeWindowState();

		// Initialize the developer tools
		this.initializeDeveloperTools();

		// Testing
		//var Proctor = Framework.require('framework/system/test/Proctor.js');
		//var proctor = new Proctor('electron');
		//proctor.getAndRunTests();
		//return;

		// Require and construct the application
		var applicationClassFilePath = 'Application';

		// Require and construct the main view controller
		var viewControllerClassFilePath = 'view-controllers/'+app.modules.electronModule.settings.get('mainBrowserWindow.viewControllerName')+'.js';
		var ViewControllerClass = app.require(viewControllerClassFilePath);
		mainViewController = this.mainBrowserWindowViewController = new ViewControllerClass(this);
		
		
		settings: new Settings({
			'default1': 1,
			'default2': 2,
		});

		var mysettinginlocalstorage = LocalStorage.get('thing');
		this.settings.set('mysettinginlocalstorage', mysettinginlocalstorage);

		this.quickAccess = this.setting.get('mysettinginlocalstorage');

		// Add default shortcuts
		this.registerShortcuts();

		// Conditionally show the main browser window
		var windowStateSettings = app.modules.electronModule.settings.get('mainBrowserWindow.windowState');
		if(windowStateSettings.show) {
			this.mainBrowserWindow.show();
		}
	},

	initializeDeveloperTools: function() {
		// Handle developer tools settings
		var developerToolsSettings = app.modules.electronModule.settings.get('mainBrowserWindow.developerTools');

		// Show the developer tools
		if(developerToolsSettings.show) {
			// Open the developer tools
			this.mainBrowserWindow.openDevTools();	
		}
	},

	initializeWindowState: function() {
		// Get the window state settings
		var windowStateSettings = app.modules.electronModule.settings.get('mainBrowserWindow.windowState');

		// Create a window state for the main browser window
		this.mainBrowserWindowState = new BrowserWindowState('main', this.mainBrowserWindow, windowStateSettings);
	},

	registerShortcuts: function() {
		// If the main browser window has an HtmlDocument
		if(this.mainBrowserWindowViewController.viewContainer) {
			var shortcutSettings = app.modules.electronModule.settings.get('shortcuts');

			//console.log('This next line is for testing input.key events.');
			//this.mainBrowserWindowViewController.viewContainer.on('input.*', function(event) {});
			//return;
			
			if(shortcutSettings.closeFocusedWindow) {
				this.mainBrowserWindowViewController.viewContainer.on('input.key.w.control', this.closeFocusedWindow.bind(this));
			}
			if(shortcutSettings.reloadFocusedWindow) {
				this.mainBrowserWindowViewController.viewContainer.on('input.key.r.(control|command)', this.reloadFocusedWindow.bind(this));
			}
			if(shortcutSettings.toggleFullScreenOnFocusedWindow) {
				this.mainBrowserWindowViewController.viewContainer.on('input.key.f11.(control|command)', this.toggleFullScreenOnFocusedWindow.bind(this));
			}
			if(shortcutSettings.toggleDeveloperToolsOnFocusedWindow) {
				this.mainBrowserWindowViewController.viewContainer.on('input.key.i.alt.(control|command)', this.toggleDeveloperToolsOnFocusedWindow.bind(this));
			}
			if(shortcutSettings.applyDefaultWindowStateOnFocusedWindow) {
				this.mainBrowserWindowViewController.viewContainer.on('input.key.d.(control|command)', this.applyDefaultWindowStateOnFocusedWindow.bind(this));
			}
		}
	},

	applyDefaultWindowStateOnFocusedWindow: function() {
		//app.log(applyDefaultWindowStateOnFocusedWindow);

		// TODO: For apps with multiple windows, need to make this work on the focused window
		this.mainBrowserWindowState.applyDefault();
	},

	closeFocusedWindow: function() {
		var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.close();
		}
	},

	reset: function(callback) {
		Console.standardWarn(Electron.remote.getCurrentWebContents().session);
		//return;
		Electron.remote.getCurrentWebContents().session.clearStorageData(
			{
				storages: [
					'appcache',
					'cookies',
					'filesystem',
					'indexdb',
					'localstorage',
					'shadercache',
					'websql',
					'serviceworkers',
				],
				quotas: [
					'temporary',
					'persistent',
					'syncable',
				],
			},
			function() {} // Pass an empty callback - https://github.com/electron/electron/issues/6491
		);
	},

	exit: function() {
		Electron.remote.app.quit();
	},

	reloadFocusedWindow: function() {
		var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.reload();
		}
	},

	toggleFullScreenOnFocusedWindow: function() {
		var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
		}
	},

	toggleDeveloperToolsOnFocusedWindow: function() {
		var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.toggleDevTools();
		}
	},

	getDefaultMenu: function() {
		var menu = null;
		var defaultMenu = this.getDefaultMenuTemplate();

		if(defaultMenu) {
			menu = Electron.remote.Menu.buildFromTemplate(this.getDefaultMenuTemplate());	
		}

		return menu;
	},

	getDefaultMenuTemplate: function() {
		var template = null;

		// If on OS X
		if(process.platform == 'darwin') {
			template = [
				{
					label: app.title,
					submenu: [
						{
							label: 'About '+app.title,
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
							label: 'Hide '+app.title,
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
							click: this.exit.bind(this),
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
			];
		}

		return template;
	},

});

// Static methods

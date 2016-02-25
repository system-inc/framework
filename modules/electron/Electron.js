// Dependencies
var ElectronRemote = Node.require('remote');
var ElectronApplication = ElectronRemote.require('app');
var ElectronShell = ElectronRemote.require('shell');
var ElectronDialog = ElectronRemote.require('dialog');
var ElectronScreen = ElectronRemote.require('screen');
var ElectronMenu = ElectronRemote.require('menu');
var ElectronMenuItem = ElectronRemote.require('menu-item');
var ElectronBrowserWindow = ElectronRemote.require('browser-window');
var BrowserWindowState = Framework.require('modules/electron/BrowserWindowState.js');
var Controller = Framework.require('modules/web-server/Controller.js');

// Class
var Electron = Class.extend({

	mainBrowserWindow: null,
	mainBrowserWindowState: null,
	mainBrowserWindowController: null,

	initialize: function*() {
		// Do nothing if Electron is not active (e.g., we are running a Framework app that uses Electron but from the console so there is no Electron window)
		if(!Node.Process.versions.electron) {
			Console.warn('Electron is disabled. No Electron application code will be executed.');
			return;
		}

		// Set the application menu
		ElectronMenu.setApplicationMenu(this.getDefaultMenu());

		// Remove all screen event listeners to prevent duplicate listeners from being attached on browser window refresh
		ElectronScreen.removeAllListeners();

		// Set the main browser window
		this.mainBrowserWindow = ElectronRemote.getCurrentWindow();

		// Set the Project title
		this.mainBrowserWindow.setTitle(Project.title);

		// Initialize the window state
		this.initializeWindowState();

		// Initialize the developer tools
		this.initializeDeveloperTools();

		// Testing
		//var Proctor = Framework.require('modules/test/Proctor.js');
		//var proctor = new Proctor('electron');
		//proctor.getAndRunTests();
		//return;

		// Require and construct the main controller
		var ControllerClass = Project.require('controllers/'+Project.modules.electronModule.settings.get('mainBrowserWindow.viewControllerName')+'.js');
		this.mainBrowserWindowController = new ControllerClass();

		// Add default keyboard shortcuts
		this.addDefaultKeyboardShortcuts();

		// Show the main browser window
		this.mainBrowserWindow.show();
	},

	initializeDeveloperTools: function() {
		// Handle developer tools settings
		var developerToolsSettings = Project.modules.electronModule.settings.get('mainBrowserWindow.developerTools');

		// Show the developer tools
		if(developerToolsSettings.show) {
			// Open the developer tools
			this.mainBrowserWindow.openDevTools();	
		}
	},

	initializeWindowState: function() {
		// Get the window state settings
		var windowStateSettings = Project.modules.electronModule.settings.get('mainBrowserWindow.windowState');

		// Create a window state for the main browser window
		this.mainBrowserWindowState = new BrowserWindowState('main', this.mainBrowserWindow, windowStateSettings);
	},

	addDefaultKeyboardShortcuts: function(htmlDocument) {
		var keyboardShortcutSettings = Project.modules.electronModule.settings.get('keyboardShortcuts');
		
		if(keyboardShortcutSettings.closeFocusedWindow) {
			this.mainBrowserWindowController.htmlDocument.keyboardShortcutManager.add(['Ctrl+W'], this.closeFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.reloadFocusedWindow) {
			this.mainBrowserWindowController.htmlDocument.keyboardShortcutManager.add(['Ctrl+R', 'Command+R'], this.reloadFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.toggleFullScreenOnFocusedWindow) {
			this.mainBrowserWindowController.htmlDocument.keyboardShortcutManager.add(['F11', 'Ctrl+Command+F'], this.toggleFullScreenOnFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.toggleDeveloperToolsOnFocusedWindow) {
			this.mainBrowserWindowController.htmlDocument.keyboardShortcutManager.add(['Ctrl+Alt+I', 'Ctrl+Command+I', 'Alt+Command+I'], this.toggleDeveloperToolsOnFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.applyDefaultWindowStateOnFocusedWindow) {
			this.mainBrowserWindowController.htmlDocument.keyboardShortcutManager.add(['Ctrl+Alt+W', 'Ctrl+Command+W', 'Alt+Command+W'], this.applyDefaultWindowStateOnFocusedWindow.bind(this));
		}
	},

	applyDefaultWindowStateOnFocusedWindow: function() {
		//Console.log(applyDefaultWindowStateOnFocusedWindow);

		// TODO: For apps with multiple windows, need to make this work on the focused window
		this.mainBrowserWindowState.applyDefault();
	},

	closeFocusedWindow: function() {
		var focusedWindow = this.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.close();
		}
	},

	reset: function(callback) {
		this.mainBrowserWindow.webContents.session.clearStorageData(
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
			callback
		);
	},

	exit: function() {
		ElectronApplication.quit();
	},

	reloadFocusedWindow: function() {
		var focusedWindow = this.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.reload();
		}
	},

	toggleFullScreenOnFocusedWindow: function() {
		var focusedWindow = this.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
		}
	},

	toggleDeveloperToolsOnFocusedWindow: function() {
		var focusedWindow = this.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.toggleDevTools();
		}
	},

	getDefaultMenu: function() {
		var menu = null;
		var defaultMenu = this.getDefaultMenuTemplate();

		if(defaultMenu) {
			menu = ElectronMenu.buildFromTemplate(this.getDefaultMenuTemplate());	
		}

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

// Export
module.exports = Electron;
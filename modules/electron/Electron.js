Electron = new (Class.extend({

	// Classes
	Menu: null,
	MenuItem: null,
	BrowserWindow: null,

	// Properties
	remote: null,
	application: null,
	shell: null,
	screen: null,
	dialog: null,
	mainBrowserWindow: null,
	mainBrowserWindowState: null,

	initialize: function*() {
		// Do nothing if Electron is not active (e.g., we are running a Framework app that uses Electron but from the console so there is no Electron window)
		if(!Node.Process.versions.electron) {
			Console.warn('Electron is disabled. No Electron application code will be executed.');
			return;
		}

		// Remotely access Application variables in this renderer process
		this.remote = require('remote');

		// Set application
		this.application = this.remote.require('app');

		// Set shell
		this.shell = this.remote.require('shell');

		// Set dialog
		this.dialog = this.remote.require('dialog');

		// Set the menu
		this.Menu = this.remote.require('menu');
		this.MenuItem = this.remote.require('menu-item');
		this.Menu.setApplicationMenu(this.getDefaultMenu());

		// Set the screen
		this.screen = require('screen');

		// Remove all screen event listeners to prevent duplicate listeners from being attached on browser window refresh
		this.screen.removeAllListeners();

		// Set the BrowserWindow
		this.BrowserWindow = this.remote.require('browser-window');

		// Set the main browser window
		this.mainBrowserWindow = this.remote.getCurrentWindow();

		// Set the Project title
		this.mainBrowserWindow.setTitle(Project.title);

		// Initialize the window state
		this.initializeWindowState();

		// Initialize the developer tools
		this.initializeDeveloperTools();

		// Add default keyboard shortcuts
		this.addDefaultKeyboardShortcuts();

		// Require and construct the main WebController
		window.webController = Controller.getController(ElectronModule.settings.get('mainBrowserWindow.webControllerName'));

		// Load the HtmlDocument from the main WebController
		window.htmlDocument = yield webController[ElectronModule.settings.get('mainBrowserWindow.webControllerMethodName')]();
		//console.log(htmlDocument);
		
		// Mount the HtmlDocument onto the DOM
		window.htmlDocument.mountToDom();

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
		this.mainBrowserWindowState = new ElectronWindowState('main', this.mainBrowserWindow, windowStateSettings);
	},

	addDefaultKeyboardShortcuts: function() {
		var keyboardShortcutSettings = ElectronModule.settings.get('keyboardShortcuts');
		//console.log(keyboardShortcutSettings); 

		if(keyboardShortcutSettings.closeFocusedWindow) {
			KeyboardShortcuts.add(['Ctrl+W'], this.closeFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.reloadFocusedWindow) {
			KeyboardShortcuts.add(['Ctrl+R', 'Command+R'], this.reloadFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.toggleFullScreenOnFocusedWindow) {
			KeyboardShortcuts.add(['F11', 'Ctrl+Command+F'], this.toggleFullScreenOnFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.toggleDeveloperToolsOnFocusedWindow) {
			KeyboardShortcuts.add(['Ctrl+Alt+I', 'Ctrl+Command+I', 'Alt+Command+I'], this.toggleDeveloperToolsOnFocusedWindow.bind(this));
		}
		if(keyboardShortcutSettings.applyDefaultWindowStateOnFocusedWindow) {
			KeyboardShortcuts.add(['Ctrl+Alt+W', 'Ctrl+Command+W', 'Alt+Command+W'], this.applyDefaultWindowStateOnFocusedWindow.bind(this));
		}
	},

	applyDefaultWindowStateOnFocusedWindow: function() {
		//console.log(applyDefaultWindowStateOnFocusedWindow);

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
		this.application.quit();
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
			menu = this.Menu.buildFromTemplate(this.getDefaultMenuTemplate());	
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

}))();
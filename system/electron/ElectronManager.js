// Dependencies
var Electron = Node.require('electron');
var BrowserWindowState = Framework.require('system/electron/BrowserWindowState.js');

// Class
var ElectronManager = Class.extend({

	mainBrowserWindow: null,
	mainBrowserWindowState: null,
	mainBrowserWindowViewController: null,

	initialize: function*() {
		// Do nothing if Electron is not active (e.g., we are running a Framework app that uses Electron but from the console so there is no Electron window)
		if(!Node.Process.versions.electron) {
			Console.warn('Electron is disabled. No Electron application code will be executed.');
			return;
		}

		// Set the application menu
		Electron.remote.Menu.setApplicationMenu(this.getDefaultMenu());

		// Remove all screen event listeners to prevent duplicate listeners from being attached on browser window refresh
		Electron.remote.screen.removeAllListeners();

		// Set the main browser window
		this.mainBrowserWindow = Electron.remote.getCurrentWindow();

		// Set the Project title
		this.mainBrowserWindow.setTitle(Project.title);

		// Initialize the window state
		this.initializeWindowState();

		// Initialize the developer tools
		this.initializeDeveloperTools();

		// Testing
		//var Proctor = Framework.require('system/test/Proctor.js');
		//var proctor = new Proctor('electron');
		//proctor.getAndRunTests();
		//return;

		// Require and construct the main controller
		var ControllerClass = Project.require('controllers/'+Project.modules.electronModule.settings.get('mainBrowserWindow.viewControllerName')+'.js');
		mainBrowserWindowViewController = this.mainBrowserWindowViewController = new ControllerClass(this);

		// Add default shortcuts
		this.addDefaultShortcuts();

		// Conditionally show the main browser window
		var windowStateSettings = Project.modules.electronModule.settings.get('mainBrowserWindow.windowState');
		if(windowStateSettings.show) {
			this.mainBrowserWindow.show();
		}
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

	addDefaultShortcuts: function(htmlDocument) {
		var shortcutSettings = Project.modules.electronModule.settings.get('shortcuts');
		
		if(shortcutSettings.closeFocusedWindow) {
			this.mainBrowserWindowViewController.htmlDocument.shortcutManager.add(['Ctrl+W'], this.closeFocusedWindow.bind(this));
		}
		if(shortcutSettings.reloadFocusedWindow) {
			this.mainBrowserWindowViewController.htmlDocument.shortcutManager.add(['Ctrl+R', 'Command+R'], this.reloadFocusedWindow.bind(this));
		}
		if(shortcutSettings.toggleFullScreenOnFocusedWindow) {
			this.mainBrowserWindowViewController.htmlDocument.shortcutManager.add(['F11', 'Ctrl+Command+F'], this.toggleFullScreenOnFocusedWindow.bind(this));
		}
		if(shortcutSettings.toggleDeveloperToolsOnFocusedWindow) {
			this.mainBrowserWindowViewController.htmlDocument.shortcutManager.add(['Ctrl+Alt+I', 'Ctrl+Command+I', 'Alt+Command+I'], this.toggleDeveloperToolsOnFocusedWindow.bind(this));
		}
		if(shortcutSettings.applyDefaultWindowStateOnFocusedWindow) {
			this.mainBrowserWindowViewController.htmlDocument.shortcutManager.add(['Ctrl+Alt+W', 'Ctrl+Command+W', 'Alt+Command+W'], this.applyDefaultWindowStateOnFocusedWindow.bind(this));
		}
	},

	applyDefaultWindowStateOnFocusedWindow: function() {
		//Console.log(applyDefaultWindowStateOnFocusedWindow);

		// TODO: For apps with multiple windows, need to make this work on the focused window
		this.mainBrowserWindowState.applyDefault();
	},

	closeFocusedWindow: function() {
		var focusedWindow = Electron.BrowserWindow.getFocusedWindow();
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
		Electron.app.quit();
	},

	reloadFocusedWindow: function() {
		var focusedWindow = Electron.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.reload();
		}
	},

	toggleFullScreenOnFocusedWindow: function() {
		var focusedWindow = Electron.BrowserWindow.getFocusedWindow();
		if(focusedWindow) {
			focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
		}
	},

	toggleDeveloperToolsOnFocusedWindow: function() {
		var focusedWindow = Electron.BrowserWindow.getFocusedWindow();
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

// Static methods

ElectronManager.clickHtmlElement = function(htmlElement, webContents) {
	// Default to the current browser window web contents
	if(!webContents) {
		webContents = Electron.remote.getCurrentWebContents();
	}

	return new Promise(function(resolve, reject) {
		// Get the x and y of the htmlElement
		var sizeAndPosition = htmlElement.getSizeAndPosition();
		//Console.log('sizeAndPosition', sizeAndPosition);

		// When mouse up is sent, resolve the promise
		var callback = function(event, data) {
			//Console.standardInfo('ipc-message-sync', arguments);
			if(
				data &&
				data[0] == 'ELECTRON_BROWSER_MEMBER_CALL' &&
				data[2] == 'sendInputEvent' &&
				data[3] &&
				data[3][0] &&
				data[3][0].members &&
				data[3][0].members[0].name == 'type' &&
				data[3][0].members[0].value.value == 'mouseUp' &&
				data[3][0].members[1].name == 'x' &&
				data[3][0].members[1].value.value == sizeAndPosition.position.relativeToViewport.left &&
				data[3][0].members[2].name == 'y' &&
				data[3][0].members[2].value.value == sizeAndPosition.position.relativeToViewport.top &&
				data[3][0].members[3].name == 'button' &&
				data[3][0].members[3].value.value == 'left' &&
				data[3][0].members[4].name == 'clickCount' &&
				data[3][0].members[4].value.value == 1
			) {
				// Remove the listener
				webContents.removeListener('ipc-message-sync', callback);
				//Console.log('ElectronManager.clickHtmlElement resolved');
				resolve(true);
			}
		};
		webContents.on('ipc-message-sync', callback);

		// A trusted click will be fired after mouse down and mouse up

		// Send mouse down
		webContents.sendInputEvent({
			// The order of these matter
			type: 'mouseDown',
			x: sizeAndPosition.position.relativeToViewport.left,
			y: sizeAndPosition.position.relativeToViewport.top,
			button: 'left',
			clickCount: 1,
		});

		// Send mouse up
		webContents.sendInputEvent({
			// The order of these matter
			type: 'mouseUp',
			x: sizeAndPosition.position.relativeToViewport.left,
			y: sizeAndPosition.position.relativeToViewport.top,
			button: 'left',
			clickCount: 1,
		});
	});
};

ElectronManager.keyboardKeyPress = function() {
//if (code !== '\u000d') {
//webview.sendInputEvent({
//type: 'keyDown',
//keyCode: code
//});
//webview.sendInputEvent({
//type: 'keyUp',
//keyCode: code
//});
//}
//webview.sendInputEvent({
//type: 'char',
//keyCode: code
//});

//webview.sendInputEvent({type:'mouseUp', x:250, y: 300, button:'left', clickCount: 1, modifiers: ['leftButtonDown']});
};

// Export
module.exports = ElectronManager;
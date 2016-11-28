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

ElectronManager.sendInputEventMouse = function(type, x, y, button, globalX, globalY, movementX, movementY, clickCount) {
	// Get the current web contents
	var webContents = Electron.remote.getCurrentWebContents();

	return new Promise(function(resolve, reject) {
		webContents.sendInputEvent({
			type: type, // mouseDown, mouseUp, mouseEnter, mouseLeave, contextMenu, mouseWheel, mouseMove, keyDown, keyUp, char
			x: x, // Integer (required)
			y: y, // Integer (required)
			button: button, // String - The button pressed, can be left, middle, right
			globalX: globalX, // Integer
			globalY: globalY, // Integer
			movementX: movementX, // Integer
			movementY: movementY, // Integer
			clickCount: clickCount, // Integer
		});

		Function.delay(50, function() {
			resolve(true);
		});
	});
};

ElectronManager.clickView = function(view, button, clickCount, modifiers) {
	var viewPosition = view.getPosition();
	//Console.standardWarn('viewPosition', viewPosition);

	return ElectronManager.click(Number.round(viewPosition.relativeToDocumentViewport.x), Number.round(viewPosition.relativeToDocumentViewport.y), button, clickCount, modifiers);
};

ElectronManager.doubleClickView = function(view, button, clickCount, modifiers) {
	var viewPosition = view.getPosition();
	//Console.standardWarn('viewPosition', viewPosition);

	return ElectronManager.click(Number.round(viewPosition.relativeToDocumentViewport.x), Number.round(viewPosition.relativeToDocumentViewport.y), button, 2, modifiers);
};

ElectronManager.click = function(relativeToDocumentViewportX, relativeToDocumentViewportY, button, clickCount, modifiers) {
	// Default the button to left
	if(!button) {
		button = 'left';
	}

	// Default clickCount to 1
	if(!clickCount) {
		clickCount = 1;
	}

	// Default modifiers to an empty array
	if(!modifiers) {
		modifiers = []; // shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	}

	// Get the current web contents
	var webContents = Electron.remote.getCurrentWebContents();

	return new Promise(function(resolve, reject) {
		// A trusted click will be fired after mouse down and mouse up

		// Send mouse down
		webContents.sendInputEvent({
			type: 'mouseDown',
			x: relativeToDocumentViewportX,
			y: relativeToDocumentViewportY,
			button: button,
			clickCount: clickCount,
			modifiers: modifiers,
		});

		// Send mouse up
		webContents.sendInputEvent({
			type: 'mouseUp',
			x: relativeToDocumentViewportX,
			y: relativeToDocumentViewportY,
			button: button,
			clickCount: clickCount,
			modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		Function.delay(50, function() {
			resolve(true);
		});
	});
};

ElectronManager.wheelRotateHtmlElement = function(view, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers) {
	var viewPosition = view.getPosition();
	return ElectronManager.wheelRotate(Number.round(viewPosition.relativeToDocumentViewport.x), Number.round(viewPosition.relativeToDocumentViewport.y),  deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers);
};

ElectronManager.wheelRotate = function(relativeToDocumentViewportX, relativeToDocumentViewportY, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers) {
	// Default modifiers to an empty array
	if(!modifiers) {
		modifiers = []; // shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	}

	// Get the current web contents
	var webContents = Electron.remote.getCurrentWebContents();

	return new Promise(function(resolve, reject) {
		// A trusted click will be fired after mouse down and mouse up

		// Send mouse down
		webContents.sendInputEvent({
			type: 'mouseWheel',
			// x, y is the mouse position inside element where the scroll should occur.
			x: relativeToDocumentViewportX,
			y: relativeToDocumentViewportY,
			//button: 'middle',
			//clickCount: 0,
			// deltaX, deltaY is the relative scroll amount
			deltaX: deltaX,
			deltaY: deltaY,
			wheelTicksX: wheelTicksX,
			wheelTicksY: wheelTicksY,
			accelerationRatioX: accelerationRatioX,
			accelerationRatioY: accelerationRatioY,
			//hasPreciseScrollingDeltas: null,
			canScroll: true,
			//modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		Function.delay(50, function() {
			resolve(true);
		});
	});
};

ElectronManager.pressKey = function*(key, modifiers) {
	//Console.standardWarn('ElectronManager.pressKey', key);

	// Default modifiers to an empty array
	if(!modifiers) {
		modifiers = []; // shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	}

	yield ElectronManager.keyDown(key, modifiers);
	yield ElectronManager.keyUp(key, modifiers);
	yield ElectronManager.keyPress(key, modifiers);
}.toPromise();

ElectronManager.keyDown = function(key, modifiers) {
	// Get the current web contents
	var webContents = Electron.remote.getCurrentWebContents();

	// Default modifiers to an empty array
	if(!modifiers) {
		modifiers = []; // shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	}

	return new Promise(function(resolve, reject) {
		//Console.standardWarn('ElectronManager.keyDown', key, modifiers);

		// Need to send all three events
		webContents.sendInputEvent({
			type: 'keyDown',
			keyCode: key,
			modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		Function.delay(50, function() {
			resolve(true);
		});
	});
};

ElectronManager.keyUp = function(key, modifiers) {
	// Get the current web contents
	var webContents = Electron.remote.getCurrentWebContents();

	// Default modifiers to an empty array
	if(!modifiers) {
		modifiers = []; // shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	}

	return new Promise(function(resolve, reject) {
		//Console.standardWarn('ElectronManager.keyUp', key, modifiers);

		webContents.sendInputEvent({
			type: 'keyUp',
			keyCode: key,
			modifiers: modifiers,
		});

		Function.delay(50, function() {
			resolve(true);
		});
	});
};

ElectronManager.keyPress = function(key, modifiers) {
	// Get the current web contents
	var webContents = Electron.remote.getCurrentWebContents();

	// Default modifiers to an empty array
	if(!modifiers) {
		modifiers = []; // shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	}

	return new Promise(function(resolve, reject) {
		//Console.standardWarn('ElectronManager.keyPress', key, modifiers);

		webContents.sendInputEvent({
			type: 'char',
			keyCode: key,
			modifiers: modifiers,
		});

		Function.delay(50, function() {
			resolve(true);
		});
	});
};

ElectronManager.copyUsingKeyboard = function*() {
	if(app.onWindows()) {
		yield ElectronManager.keyDown('c', ['control']);
	}
	else {
		// TODO: Does not work on macOS
		app.warn('ElectronManager.copyUsingKeyboard does not work on macOS.');
		yield ElectronManager.keyDown('c', ['meta']);
	}
}.toPromise();

ElectronManager.cutUsingKeyboard = function*() {
	if(app.onWindows()) {
		yield ElectronManager.keyDown('x', ['control']);
	}
	else {
		// TODO: Does not work on macOS
		app.warn('ElectronManager.cutUsingKeyboard does not work on macOS.');
		yield ElectronManager.keyDown('x', ['meta']);
	}
}.toPromise();

ElectronManager.pasteUsingKeyboard = function*() {
	if(app.onWindows()) {
		yield ElectronManager.keyDown('v', ['control']);
	}
	else {
		// TODO: Does not work on macOS
		app.warn('ElectronManager.pasteUsingKeyboard does not work on macOS.');
		yield ElectronManager.keyDown('v', ['meta']);
	}
}.toPromise();

ElectronManager.getBrowserWindowBounds = function() {
	var bounds = Electron.remote.getCurrentWindow().getBounds();

	return bounds;
};

ElectronManager.setBrowserWindowBounds = function(width, height, x, y) {
	Electron.remote.getCurrentWindow().setBounds({
		width: width,
		height: height,
		x: x,
		y: y,
	});
};

// Export
module.exports = ElectronManager;
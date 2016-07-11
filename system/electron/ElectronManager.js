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

	addDefaultShortcuts: function() {
		// If the main browser window has an HtmlDocument
		if(this.mainBrowserWindowViewController.htmlDocument) {
			var shortcutSettings = Project.modules.electronModule.settings.get('shortcuts');

			console.log('This next line is for testing input.key events.');
			this.mainBrowserWindowViewController.htmlDocument.on('input.*', function(event) {});
			
			if(shortcutSettings.closeFocusedWindow) {
				this.mainBrowserWindowViewController.htmlDocument.on('input.key.w.control', this.closeFocusedWindow.bind(this));
			}
			if(shortcutSettings.reloadFocusedWindow) {
				this.mainBrowserWindowViewController.htmlDocument.on('input.key.r.(control|command)', this.reloadFocusedWindow.bind(this));
			}
			if(shortcutSettings.toggleFullScreenOnFocusedWindow) {
				this.mainBrowserWindowViewController.htmlDocument.on('input.key.f11', this.toggleFullScreenOnFocusedWindow.bind(this));
			}
			if(shortcutSettings.toggleDeveloperToolsOnFocusedWindow) {
				this.mainBrowserWindowViewController.htmlDocument.on('input.key.i.alt.(control|command)', this.toggleDeveloperToolsOnFocusedWindow.bind(this));
			}
			if(shortcutSettings.applyDefaultWindowStateOnFocusedWindow) {
				this.mainBrowserWindowViewController.htmlDocument.on('input.key.d.(control|command)', this.applyDefaultWindowStateOnFocusedWindow.bind(this));
			}
		}
	},

	applyDefaultWindowStateOnFocusedWindow: function() {
		//Console.log(applyDefaultWindowStateOnFocusedWindow);

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

ElectronManager.clickHtmlElement = function(htmlElement, button, clickCount, modifiers) {
	var htmlElementPosition = htmlElement.getPosition();
	//Console.standardWarn('htmlElementPosition', htmlElementPosition);

	return ElectronManager.click(Number.round(htmlElementPosition.relativeToDocumentViewport.x), Number.round(htmlElementPosition.relativeToDocumentViewport.y), button, clickCount, modifiers);
};

ElectronManager.doubleClickHtmlElement = function(htmlElement, button, clickCount, modifiers) {
	var htmlElementPosition = htmlElement.getPosition();
	//Console.standardWarn('htmlElementPosition', htmlElementPosition);

	return ElectronManager.click(Number.round(htmlElementPosition.relativeToDocumentViewport.x), Number.round(htmlElementPosition.relativeToDocumentViewport.y), button, 2, modifiers);
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

ElectronManager.wheelRotateHtmlElement = function(htmlElement, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers) {
	var htmlElementPosition = htmlElement.getPosition();
	return ElectronManager.wheelRotate(Number.round(htmlElementPosition.relativeToDocumentViewport.x), Number.round(htmlElementPosition.relativeToDocumentViewport.y),  deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers);
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
	if(Project.onWindows()) {
		yield ElectronManager.keyDown('c', ['control']);
	}
	else {
		// TODO: Does not work on macOS
		Console.warn('ElectronManager.copyUsingKeyboard does not work on macOS.');
		yield ElectronManager.keyDown('c', ['meta']);
	}
}.toPromise();

ElectronManager.cutUsingKeyboard = function*() {
	if(Project.onWindows()) {
		yield ElectronManager.keyDown('x', ['control']);
	}
	else {
		// TODO: Does not work on macOS
		Console.warn('ElectronManager.cutUsingKeyboard does not work on macOS.');
		yield ElectronManager.keyDown('x', ['meta']);
	}
}.toPromise();

ElectronManager.pasteUsingKeyboard = function*() {
	if(Project.onWindows()) {
		yield ElectronManager.keyDown('v', ['control']);
	}
	else {
		// TODO: Does not work on macOS
		Console.warn('ElectronManager.pasteUsingKeyboard does not work on macOS.');
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
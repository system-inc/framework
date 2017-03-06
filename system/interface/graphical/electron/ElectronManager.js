// Dependencies
import Electron from 'electron';
import Directory from 'framework/system/file-system/Directory.js';

// Class
class ElectronManager {

	//initialize: function*() {
	//	// Do nothing if Electron is not active (e.g., we are running a Framework app that uses Electron but from the console so there is no Electron window)
	//	if(!Node.Process.versions.electron) {
	//		app.warn('Electron is disabled. No Electron application code will be executed.');
	//		return;
	//	}

	//	// Set the application menu
	//	Electron.remote.Menu.setApplicationMenu(this.getDefaultMenu());

	//	// Remove all screen event listeners to prevent duplicate listeners from being attached on browser window refresh
	//	Electron.remote.screen.removeAllListeners();

	//	// Set the main browser window
	//	this.mainBrowserWindow = Electron.remote.getCurrentWindow();

	//	// Set the app title
	//	this.mainBrowserWindow.setTitle(app.title);

	//	// Initialize the window state
	//	this.initializeWindowState();

	//	// Initialize the developer tools
	//	this.initializeDeveloperTools();

	//	// Testing
	//	//var Proctor = Framework.require('framework/system/test/Proctor.js');
	//	//var proctor = new Proctor('electron');
	//	//proctor.getAndRunTests();
	//	//return;

	//	// Require and construct the application
	//	var applicationClassFilePath = 'Application';

	//	// Require and construct the main view controller
	//	var viewControllerClassFilePath = 'view-controllers/'+app.modules.electronModule.settings.get('mainBrowserWindow.viewControllerName')+'.js';
	//	var ViewControllerClass = app.require(viewControllerClassFilePath);
	//	mainViewController = this.mainBrowserWindowViewController = new ViewControllerClass(this);
		
		
	//	settings: new Settings({
	//		'default1': 1,
	//		'default2': 2,
	//	});

	//	var mysettinginlocalstorage = LocalStorage.get('thing');
	//	this.settings.set('mysettinginlocalstorage', mysettinginlocalstorage);

	//	this.quickAccess = this.setting.get('mysettinginlocalstorage');

	//	// Add default shortcuts
	//	this.registerShortcuts();

	//	// Conditionally show the main browser window
	//	var windowStateSettings = app.modules.electronModule.settings.get('mainBrowserWindow.windowState');
	//	if(windowStateSettings.show) {
	//		this.mainBrowserWindow.show();
	//	}
	//},

	//initializeDeveloperTools: function() {
	//	// Handle developer tools settings
	//	var developerToolsSettings = app.modules.electronModule.settings.get('mainBrowserWindow.developerTools');

	//	// Show the developer tools
	//	if(developerToolsSettings.show) {
	//		// Open the developer tools
	//		this.mainBrowserWindow.openDevTools();	
	//	}
	//},

	//registerShortcuts: function() {
	//	// If the main browser window has an HtmlDocument
	//	if(this.mainBrowserWindowViewController.viewContainer) {
	//		var shortcutSettings = app.modules.electronModule.settings.get('shortcuts');

	//		//console.log('This next line is for testing input.key events.');
	//		//this.mainBrowserWindowViewController.viewContainer.on('input.*', function(event) {});
	//		//return;
			
	//		if(shortcutSettings.closeFocusedWindow) {
	//			this.mainBrowserWindowViewController.viewContainer.on('input.key.w.control', this.closeFocusedWindow.bind(this));
	//		}
	//		if(shortcutSettings.reloadFocusedWindow) {
	//			this.mainBrowserWindowViewController.viewContainer.on('input.key.r.(control|command)', this.reloadFocusedWindow.bind(this));
	//		}
	//		if(shortcutSettings.toggleFullScreenOnFocusedWindow) {
	//			this.mainBrowserWindowViewController.viewContainer.on('input.key.f11.(control|command)', this.toggleFullScreenOnFocusedWindow.bind(this));
	//		}
	//		if(shortcutSettings.toggleDeveloperToolsOnFocusedWindow) {
	//			this.mainBrowserWindowViewController.viewContainer.on('input.key.i.alt.(control|command)', this.toggleDeveloperToolsOnFocusedWindow.bind(this));
	//		}
	//		if(shortcutSettings.applyDefaultWindowStateOnFocusedWindow) {
	//			this.mainBrowserWindowViewController.viewContainer.on('input.key.d.(control|command)', this.applyDefaultWindowStateOnFocusedWindow.bind(this));
	//		}
	//	}
	//},

	//applyDefaultWindowStateOnFocusedWindow: function() {
	//	//app.log(applyDefaultWindowStateOnFocusedWindow);

	//	// TODO: For apps with multiple windows, need to make this work on the focused window
	//	this.mainBrowserWindowState.applyDefault();
	//},

	//closeFocusedWindow: function() {
	//	var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.close();
	//	}
	//},

	//exit() {
	//	Electron.remote.app.quit();
	//}

	//reloadFocusedWindow() {
	//	var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.reload();
	//	}
	//}

	//toggleFullScreenOnFocusedWindow() {
	//	var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
	//	}
	//}

	//toggleDeveloperToolsOnFocusedWindow() {
	//	var focusedWindow = Electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.toggleDevTools();
	//	}
	//}

	//static async copyUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronGraphicalInterfaceAdapter.keyDown('c', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('ElectronManager.copyUsingKeyboard does not work on macOS.');
	//		yield ElectronManager.keyDown('c', ['meta']);
	//	}
	//}

	//static async cutUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronManager.keyDown('x', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('ElectronManager.cutUsingKeyboard does not work on macOS.');
	//		yield ElectronManager.keyDown('x', ['meta']);
	//	}
	//}

	//static async pasteUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronManager.keyDown('v', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('ElectronManager.pasteUsingKeyboard does not work on macOS.');
	//		yield ElectronManager.keyDown('v', ['meta']);
	//	}
	//}

	static async sendInputEventKeyboard(type, key, modifiers) {
		var webContents = Electron.remote.getCurrentWindow().webContents;

		webContents.sendInputEvent({
			type: type,
			keyCode: key,
			modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	static async sendInputEventMouse(type, x, y, button, globalX, globalY, movementX, movementY, pressCount) {
		var webContents = Electron.remote.getCurrentWindow().webContents;

		webContents.sendInputEvent({
			type: type, // mouseDown, mouseUp, mouseEnter, mouseLeave, contextMenu, mouseWheel, mouseMove, keyDown, keyUp, char
			x: x, // Integer (required)
			y: y, // Integer (required)
			button: button, // String - The button pressed, can be left, middle, right
			globalX: globalX, // Integer
			globalY: globalY, // Integer
			movementX: movementX, // Integer
			movementY: movementY, // Integer
			clickCount: pressCount, // Integer
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	static async inputPress(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY, button = 'left', pressCount = 1, modifiers = []) {
		//console.info(...arguments);

		var webContents = Electron.remote.getCurrentWindow().webContents;

		// A trusted click will be fired after mouse down and mouse up

		// Send mouse down
		webContents.sendInputEvent({
			type: 'mouseDown',
			x: relativeToGraphicalInterfaceViewportX,
			y: relativeToGraphicalInterfaceViewportY,
			button: button,
			clickCount: pressCount,
			modifiers: modifiers,
		});

		// Send mouse up
		webContents.sendInputEvent({
			type: 'mouseUp',
			x: relativeToGraphicalInterfaceViewportX,
			y: relativeToGraphicalInterfaceViewportY,
			button: button,
			clickCount: pressCount,
			modifiers: modifiers,
		});

		// TODO: This is a hack until https://github.com/electron/electron/issues/6291
		// This seems to not resolve the promise until the input event has completed
		await Function.delay(50);

		return true;
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	static async inputScroll(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers = []) {
		var webContents = Electron.remote.getCurrentWindow().webContents;

		webContents.sendInputEvent({
			type: 'mouseWheel',
			// x, y is the mouse position inside element where the scroll should occur.
			x: relativeToGraphicalInterfaceViewportX,
			y: relativeToGraphicalInterfaceViewportY,
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
		await Function.delay(50);

		return true;
	}

	static async inputHover(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY) {
		return await ElectronManager.sendInputEventMouse('mouseMove', relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY);
	}

	static async inputKeyPress(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyPress', key, modifiers);
		await ElectronManager.sendInputEventKeyboard('char', key, modifiers);

		return true;
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	static async inputKeyPressByCombination(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.pressKey', key);

		await ElectronManager.inputKeyDown(key, modifiers);
		await ElectronManager.inputKeyUp(key, modifiers);
		await ElectronManager.inputKeyPress(key, modifiers);

		return true;
	}

	static async inputKeyDown(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyDown', key, modifiers);
		await ElectronManager.sendInputEventKeyboard('keyDown', key, modifiers);

		return true;
	}

	static async inputKeyUp(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyUp', key, modifiers);
		await ElectronManager.sendInputEventKeyboard('keyUp', key, modifiers);

		return true;
	}

}

// Export
export default ElectronManager;

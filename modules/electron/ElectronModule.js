// Dependencies
import Module from 'framework/system/module/Module.js';
import Version from 'framework/system/version/Version.js';
import Directory from 'framework/system/file-system/Directory.js';
import ElectronGraphicalInterfaceAdapter from 'framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js';
import Display from 'framework/system/interface/graphical/Display.js';

// Class
class ElectronModule extends Module {

	electron = null;

	firstGraphicalInterfaceProxy = null;

	version = new Version('0.1.0');

	defaultSettings = {
		automaticallyStartElectronIfNotInElectronContext: true,
		pathToElectronStartingJavaScriptFile: Node.Path.join(app.directory, 'index.js'),
	};

	async initialize() {
		await super.initialize(...arguments);

		// If in the Electron context
		if(this.inElectronContext()) {
			//console.warn('In Electron, configuring ElectronModule');
			this.electron = require('electron');

			// If in the Electron main process
			if(this.inElectronMainProcess()) {
				// The Electron main process is responsible for starting the first web browser window when there are no other windows
				// The Electron main process does not communicate between windows
				//console.log('Now in Electron Main Process');
				//console.warn('In Electron, configureElectronMainProcess');
				this.configureElectronMainProcess();
			}
			// If in the Electron renderer process
			else if(this.inElectronRendererProcess()) {
				//console.warn('In Electron, configureElectronRendererProcess');
				this.configureElectronRendererProcess();
			}
		}
		// Start Electron if the settings have it set to start automatically if not in the Electron context
		else if(this.settings.get('automaticallyStartElectronIfNotInElectronContext')) {
			//console.warn('Not in Electron, starting this.electron...');
			this.startElectron();
		}
	}

	async getPathToElectronExecutable() {
		var pathToElectronExecutable = null;

		// Get the electron
		var nodeModuleLookupPaths = Node.Module._resolveLookupPaths('electron')[1];
		
		// Add the node exec path
		//app.log('process.execPath', process.execPath);
		nodeModuleLookupPaths.append(process.execPath);

		//app.log('nodeModuleLookupPaths', nodeModuleLookupPaths);

		var pathToElectronModule = null;

		await nodeModuleLookupPaths.each(async function(index, lookupPath) {
			var reformedLookupPath = lookupPath;
			//app.log('reformedLookupPath', reformedLookupPath);

			if(reformedLookupPath.endsWith('node')) {
				reformedLookupPath = reformedLookupPath.replaceLast('node', 'node_modules');
			}
			else if(reformedLookupPath.endsWith('node.exe')) {
				reformedLookupPath = reformedLookupPath.replaceLast('node.exe', 'node_modules');
			}

			reformedLookupPath = Node.Path.join(reformedLookupPath, 'electron');

			if(await Directory.exists(reformedLookupPath)) {
				pathToElectronModule = reformedLookupPath;
				return false; // break
			}
		});

		//app.info('pathToElectronModule', pathToElectronModule);

		if(pathToElectronModule) {
			pathToElectronExecutable = require(pathToElectronModule);
			//app.log('pathToElectronExecutable', pathToElectronExecutable);
		}

		return pathToElectronExecutable;
	}

	async startElectron() {
		// Get the path to the Electron executable
		var pathToElectronExecutable = await this.getPathToElectronExecutable();
		//console.log('pathToElectronExecutable', pathToElectronExecutable);

		// Get the path to the Electron starting JavaScript file from settings
		var pathToElectronStartingJavaScriptFile = this.settings.get('pathToElectronStartingJavaScriptFile');

		// Pass arguments from node to the Electron main process
		var electronMainProcessArguments = ['--js-flags=--harmony', pathToElectronStartingJavaScriptFile];
		electronMainProcessArguments.merge(Node.Process.argv.slice(2));
		//console.log('Node.Process.argv', Node.Process.argv);
		//console.log('electronMainProcessArguments', electronMainProcessArguments);
		//Node.exit();

		// Run Electron as a child process, providing a .js file runs the file in the Electron main process, providing a .html file runs it in a renderer process
		// We want to run in the main process to take advantage of shared standard streams, so we provide a .js file by default
		var childProcessElectronMainProcess = Node.spawnChildProcess(pathToElectronExecutable, electronMainProcessArguments, {});

		// The parent process I am in now exists to just to as a bridge for standard streams to the child process which is the Electron main process

		// So, I remove all listeners from the parent process standard input stream
		Node.Process.stdin.removeAllListeners();

		// And send all standard input to the child process
		Node.Process.stdin.on('data', function(data) {
			childProcessElectronMainProcess.stdin.write(data);
		}.bind(this));

		// Standard out from the child process is bridged to the parent process
		childProcessElectronMainProcess.stdout.on('data', function(data) {
			//app.standardStreams.output.write('(Child Process - Electron Main Process - Standard Out) '+data.toString());
			app.standardStreams.output.write(data);
		});

		// Standard error from the child process is bridged to the parent process
		childProcessElectronMainProcess.stderr.on('data', function(data) {
			//app.standardStreams.error.write('(Child Process - Electron Main Process - Standard Error) '+data.toString());
			app.standardStreams.error.write(data);
		});

		// Kill the parent process when the child process exits
		childProcessElectronMainProcess.on('close', function(code) {
			app.standardStreams.output.writeLine('Child Process - Electron Main Process exited with code '+code+'.');
			app.exit();
		});
	}

	async configureElectronMainProcess() {
		// Before app.exit() exits the application, quit the Electron app
		app.on('app.beforeExit', function() {
			//console.log('app.beforeQuit');
			this.electron.app.quit();
		}.bind(this));
		
		// Enable Harmony for any Electron renderer processes we create, will eventually not need to do this
		this.electron.app.commandLine.appendSwitch('--js-flags', '--harmony');

		// When the app is activated from the macOS dock
		this.electron.app.on('activate', function () {
			//console.log('electron app activate');
			//console.log('this', this);

			if(this.firstGraphicalInterfaceProxy === null) {
				//console.log('this.firstGraphicalInterfaceProxy proxy is null');
				this.newGraphicalInterface();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		this.electron.app.on('window-all-closed', function () {
			//console.log('electron app window-all-closed');
			if(!app.onMacOs()) {
				this.electron.app.quit()
			}
		}.bind(this));

		// Create the first graphical interface
		await this.newGraphicalInterface();
		//console.log('this.firstGraphicalInterfaceProxy', this.firstGraphicalInterfaceProxy);
	}

	async newGraphicalInterface() {
		//console.log('new graphical interface...');

		// Use the ElectronGraphicalInterfaceAdapter to create a new graphical interface
		this.firstGraphicalInterfaceProxy = await ElectronGraphicalInterfaceAdapter.newGraphicalInterface({
			path: this.settings.get('pathToElectronStartingJavaScriptFile'),
		});

		// When graphical interface is closed
		this.firstGraphicalInterfaceProxy.on('graphicalInterface.closed', function () {
			//console.log('this.firstGraphicalInterfaceProxy.on closed');

			// Dereference the object so it will be recreated on activation (when the user presses the icon on the macOS dock)
			this.firstGraphicalInterfaceProxy = null;
		}.bind(this));

		return this.firstGraphicalInterfaceProxy;
	}

	getCurrentWindow() {
		return this.electron.remote.getCurrentWindow();
	}

	getCurrentWebContents() {
		return this.electron.remote.getCurrentWebContents();
	}

	getDisplays() {
		var displays = {};

		var electronScreens = this.electron.screen.getAllDisplays();
		//console.info('electronScreens', electronScreens);

		electronScreens.each(function(electronDisplayIndex, electronDisplay) {
			var display = new Display();

			display.identifier = electronDisplayIndex + 1;
			display.dimensions.width = electronDisplay.size.width;
			display.dimensions.height = electronDisplay.size.height;

			displays[display.identifier] = display;
		});

		return displays;
	}

	configureElectronRendererProcess() {
		// Catch unhandled rejections in Electron renderer windows
		window.addEventListener('unhandledrejection', function(error, promise) {
			console.error('(correct trace below)', error.reason.toString(), error.reason.stack.toString());
		});

		// Update the command with the command from the Electron main process
		var electronMainProcessArguments = this.electron.remote.getGlobal('process').argv;
		//console.info('electronMainProcessArguments', electronMainProcessArguments);
		app.interfaces.commandLine.initializeCommand(electronMainProcessArguments);
		//console.info('app.interfaces.commandLine', app.interfaces.commandLine);
	}

	inElectronContext() {
		var inElectronContext = false;

		if(Node.Process.versions && Node.Process.versions.electron) {
			inElectronContext = true;
		}

		return inElectronContext;
	}

	inElectronMainProcess() {
		var inElectronMainProcess = false;

		if(this.inElectronContext() && Node.Process.type !== 'renderer') {
			inElectronMainProcess = true;
		}

		return inElectronMainProcess;
	}

	inElectronRendererProcess() {
		var inElectronRendererProcess = false;

		if(this.inElectronContext() && Node.Process.type === 'renderer') {
			inElectronRendererProcess = true;
		}

		return inElectronRendererProcess;
	}

	//initialize: function*() {
	//	// Do nothing if Electron is not active (e.g., we are running a Framework app that uses Electron but from the console so there is no Electron window)
	//	if(!Node.Process.versions.electron) {
	//		app.warn('Electron is disabled. No Electron application code will be executed.');
	//		return;
	//	}

	//	// Set the application menu
	//	this.electron.remote.Menu.setApplicationMenu(this.getDefaultMenu());

	//	// Remove all screen event listeners to prevent duplicate listeners from being attached on browser window refresh
	//	this.electron.remote.screen.removeAllListeners();

	//	// Set the main browser window
	//	this.mainBrowserWindow = this.electron.remote.getCurrentWindow();

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
	//	var focusedWindow = this.electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.close();
	//	}
	//},

	//exit() {
	//	this.electron.remote.app.quit();
	//}

	//reloadFocusedWindow() {
	//	var focusedWindow = this.electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.reload();
	//	}
	//}

	//toggleFullScreenOnFocusedWindow() {
	//	var focusedWindow = this.electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
	//	}
	//}

	//toggleDeveloperToolsOnFocusedWindow() {
	//	var focusedWindow = this.electron.remote.BrowserWindow.getFocusedWindow();
	//	if(focusedWindow) {
	//		focusedWindow.toggleDevTools();
	//	}
	//}

	//async copyUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield ElectronGraphicalInterfaceAdapter.keyDown('c', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('this.copyUsingKeyboard does not work on macOS.');
	//		yield this.keyDown('c', ['meta']);
	//	}
	//}

	//async cutUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield this.keyDown('x', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('this.cutUsingKeyboard does not work on macOS.');
	//		yield this.keyDown('x', ['meta']);
	//	}
	//}

	//async pasteUsingKeyboard() {
	//	if(app.onWindows()) {
	//		yield this.keyDown('v', ['control']);
	//	}
	//	else {
	//		// TODO: Does not work on macOS
	//		console.info('this.pasteUsingKeyboard does not work on macOS.');
	//		yield this.keyDown('v', ['meta']);
	//	}
	//}

	async sendInputEventKeyboard(type, key, modifiers) {
		var webContents = this.electron.remote.getCurrentWindow().webContents;

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

	async sendInputEventMouse(type, x, y, button, globalX, globalY, movementX, movementY, pressCount) {
		var webContents = this.electron.remote.getCurrentWindow().webContents;

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
	async inputPress(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY, button = 'left', pressCount = 1, modifiers = []) {
		//console.info(...arguments);

		var webContents = this.electron.remote.getCurrentWindow().webContents;

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
	async inputScroll(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers = []) {
		var webContents = this.electron.remote.getCurrentWindow().webContents;

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

	async inputHover(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY) {
		return await this.sendInputEventMouse('mouseMove', relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY);
	}

	async inputKeyPress(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyPress', key, modifiers);
		await this.sendInputEventKeyboard('char', key, modifiers);

		return true;
	}

	// modifiers: shift, control, alt, meta, isKeypad, isAutoRepeat, leftButtonDown, middleButtonDown, rightButtonDown, capsLock, numLock, left, right
	async inputKeyPressByCombination(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.pressKey', key);

		await this.inputKeyDown(key, modifiers);
		await this.inputKeyUp(key, modifiers);
		await this.inputKeyPress(key, modifiers);

		return true;
	}

	async inputKeyDown(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyDown', key, modifiers);
		await this.sendInputEventKeyboard('keyDown', key, modifiers);

		return true;
	}

	async inputKeyUp(key, modifiers = []) {
		//console.info('ElectronGraphicalInterfaceAdapter.keyUp', key, modifiers);
		await this.sendInputEventKeyboard('keyUp', key, modifiers);

		return true;
	}
	
}

// Export
export default ElectronModule;

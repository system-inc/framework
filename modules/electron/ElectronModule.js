// Dependencies
import { Module } from '@framework/system/module/Module.js';
import { Version } from '@framework/system/version/Version.js';
import { Directory } from '@framework/system/file-system/Directory.js';
import { ElectronGraphicalInterfaceAdapter } from '@framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js';
import { Display } from '@framework/system/interface/graphical/Display.js';
import { Url } from '@framework/system/web/Url.js';

// Class
class ElectronModule extends Module {

	electron = null;

	firstBrowserWindow = null;

	version = new Version('1.0.0');

	defaultSettings = {
		// We hard code script path to .../index.cjs for now for a few reasons:
		// 1. Electron does not support ESM modules
		// 2. We need to Transpile all of our code using Babel via Transpiler.js
		// 3. index.cjs is the only entry point which will handle Transpilation
		// In the future we can switch to just including the app script file when we no longer need to transpile
		script: Node.Path.join(app.path, '/index.cjs').replaceFirst('/mnt/c/', 'c:/'), // Handle Window Subsystem for Linux
		automaticallyStartElectronIfNotInElectronContext: true,
		quitWhenAllWindowsClosedOnMacOs: false,
	};

	async initialize() {
		await super.initialize(...arguments);

		// If in the Electron context
		if(this.inElectronEnvironment()) {
			// app.log('In Electron, configuring ElectronModule');
			this.electron = await import('electron');
			//console.log('this.electron', this.electron);

			// If in the Electron main process
			if(this.inElectronMainProcess()) {
				// The Electron main process is responsible for starting the first web browser window when there are no other windows
				// The Electron main process does not communicate between windows
				// app.log('In Electron Main Process, configureElectronMainProcess');
				this.configureElectronMainProcess();
			}
			// If in the Electron renderer process
			else if(this.inElectronRendererProcess()) {
				// console.log('In Electron Renderer Process, configureElectronRendererProcess');
				this.configureElectronRendererProcess();
			}
		}
		// Start Electron if the settings have it set to start automatically if not in the Electron context
		else if(this.settings.get('automaticallyStartElectronIfNotInElectronContext')) {
			console.log('Not in Electron, starting this.electron...');
			this.startElectron();
		}
	}

	async getElectronExecutablePath() {
		var electronExecutablePath = null;

		// Get the electron
		var nodeModuleLookupPaths = Node.Module._resolveLookupPaths('electron')[1];
		
		// Add the node exec path
		//app.log('process.execPath', process.execPath);
		nodeModuleLookupPaths.append(process.execPath);

		//app.log('nodeModuleLookupPaths', nodeModuleLookupPaths);

		var electronModulePath = null;

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
				electronModulePath = reformedLookupPath;
				return false; // break
			}
		});

		//app.info('electronModulePath', electronModulePath);

		if(electronModulePath) {
			electronExecutablePath = await import(electronModulePath);
			//app.log('electronExecutablePath', electronExecutablePath);
		}

		// Check for Windows Subsystem for Linux
		if(!electronExecutablePath) {
			if(await Directory.exists('/mnt/c/Program Files/Electron/')) {
				electronExecutablePath = '/mnt/c/Program Files/Electron/electron.exe';	
			}
		}

		// Just use electron as the default if we don't have anything
		if(!electronExecutablePath) {
			electronExecutablePath = 'electron';
		}

		return electronExecutablePath;
	}

	async startElectron() {
		//console.log('ElectronModule', 'startElectron');

		// Get the path to the Electron executable
		var electronExecutablePath = await this.getElectronExecutablePath();
		// app.log('electronExecutablePath', electronExecutablePath);

		// Pass arguments from node to the Electron main process
		var electronMainProcessArguments = [
			this.settings.get('script'),
		].merge(Node.Process.argv.slice(2));
		// console.log('Node.Process.argv', Node.Process.argv);
		// console.log('electronMainProcessArguments', electronMainProcessArguments);
		//Node.exit();

		// Run Electron as a child process, providing a .cjs file runs the file in the Electron main process, providing a .html file runs it in a renderer process
		// We want to run in the main process to take advantage of shared standard streams, so we provide a .cjs file by default
		// console.log('electronExecutablePath', electronExecutablePath);
		// console.log('electronMainProcessArguments', electronMainProcessArguments);
		var childProcessElectronMainProcess = Node.spawnChildProcess(electronExecutablePath, electronMainProcessArguments);

		// The parent process I am in now exists to just to as a bridge for standard streams to the child process which is the Electron main process

		// So, I remove all listeners from the parent process standard input stream
		Node.Process.stdin.removeAllListeners();

		// And send all standard input to the child process
		Node.Process.stdin.on('data', function(data) {
			childProcessElectronMainProcess.stdin.write(data);
		}.bind(this));

		// Standard out from the child process is bridged to the parent process
		childProcessElectronMainProcess.stdout.on('data', function(data) {
			// app.standardStreams.output.write('(Child Process - Electron Main Process - Standard Out) '+data.toString());
			app.standardStreams.output.write(data);
		});

		// Standard error from the child process is bridged to the parent process
		childProcessElectronMainProcess.stderr.on('data', function(data) {
			// app.standardStreams.error.write('(Child Process - Electron Main Process - Standard Error) '+data.toString());
			app.standardStreams.error.write(data);
		});

		// Kill the parent process when the child process exits
		childProcessElectronMainProcess.on('close', function(code) {
			app.standardStreams.output.writeLine('Electron main process exited with code '+code+'.');
			app.exit();
		});
	}

	async configureElectronMainProcess() {
		//app.log('ElectronModule', 'configureElectronMainProcess');

		// Disable security warnings in Electron
		process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;

		// Before app.exit() exits the application, quit the Electron app
		app.on('app.beforeExit', function() {
			// app.log('app.beforeExit');

			this.electron.app.quit();
		}.bind(this));
		
		// When the app is activated from the macOS dock
		this.electron.app.on('activate', function () {
			// app.log('electron app event activate');

			if(this.firstBrowserWindow === null) {
				//app.log('this.firstBrowserWindow proxy is null');
				this.createFirstBrowserWindow();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		this.electron.app.on('window-all-closed', function () {
			// app.log('electron app window-all-closed');
			// app.log('quitWhenAllWindowsClosedOnMacOs', this.settings.get('quitWhenAllWindowsClosedOnMacOs'));

			if(!app.onMacOs() || this.settings.get('quitWhenAllWindowsClosedOnMacOs')) {
				this.electron.app.quit()
			}
		}.bind(this));

		// Create the first browser window when the app is ready
		if(this.electron.app.isReady()) {
			// console.log('app is ready');
			this.createFirstBrowserWindow();
		}
		// If the app is not ready, wait for the ready event
		else {
			// console.log('app is not ready');
			this.electron.app.on('ready', function () {
				this.createFirstBrowserWindow();
			}.bind(this));
		}
	}

	configureElectronRendererProcess() {
		// app.log('ElectronModule .configureElectronRendererProcess()');

		// Catch unhandled rejections in Electron renderer windows
		window.addEventListener('unhandledrejection', function(error, promise) {
			//console.log(this.electron.remote.getCurrentWindow());

			// Show the window
			this.electron.remote.getCurrentWindow().show();

			// Maximize the window
			this.electron.remote.getCurrentWindow().maximize();

			// Open the developer tools
			this.electron.remote.getCurrentWindow().openDevTools();

			// Log the error
			console.error(error.reason.stack.toString());
		}.bind(this));

		// Clear the default application menu and all of its shortcuts / accelerators
        this.electron.remote.Menu.setApplicationMenu(null);
	}

	async createFirstBrowserWindow() {
		// app.log('Creating first Electron BrowserWindow', 'script', this.settings.get('script'));

		// Use the ElectronGraphicalInterfaceAdapter to create a new graphical interface
		this.firstBrowserWindow = await this.newBrowserWindow({
			path: this.settings.get('script'),
		});

		// When graphical interface is closed
		this.firstBrowserWindow.on('closed', function(event) {
			// app.log('this.firstBrowserWindow.on close');

			// Dereference the object so it will be recreated on activation (when the user presses the icon on the macOS dock)
			this.firstBrowserWindow = null;
		}.bind(this));

		return this.firstBrowserWindow;
	}

	async newBrowserWindow(options) {
		// Set the default options
		options = {
			path: null,
			graphicalInterfaceState: {
				dimensions: {
					width: 1920,
					height: 1080,
				},
				position: {
					relativeToAllDisplays: {
						x: null,
						y: null,
					},
				},
				show: false, // Do not show the window at first, wait for it to be set to the right dimensions and position
			},
		}.merge(options);
		//console.log('newBrowserWindow', 'options', options);

		// Get the right reference for ElectronBrowserWindow based on whether or not we are in the Electron main process or in a renderer process
		var ElectronBrowserWindow = null;
		// Electron main process
		if(this.inElectronMainProcess()) {
			//console.log('inElectronMainProcess');
			ElectronBrowserWindow = this.electron.BrowserWindow;
		}
		// Electron renderer process
		else if(this.inElectronRendererProcess()) {
			//console.log('inElectronRendererProcess');
			ElectronBrowserWindow = this.electron.remote.BrowserWindow;
		}
		// app.log('ElectronBrowserWindow', ElectronBrowserWindow);
		
		// Create the Electron browser window
		var electronBrowserWindow = new ElectronBrowserWindow({
			title: app.title,
			// //parent: (app.interfaces.graphical) ? app.interfaces.graphical.adapter.electronBrowserWindow : null, // this always makes the brower window show
			width: options.graphicalInterfaceState.dimensions.width,
			height: options.graphicalInterfaceState.dimensions.height,
			x: options.graphicalInterfaceState.position.relativeToAllDisplays.x,
			y: options.graphicalInterfaceState.position.relativeToAllDisplays.y,
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			// show: options.graphicalInterfaceState.show,
			webPreferences: {
				devTools: true,
				nodeIntegration: true, // Must have this on as it is off by default
				nodeIntegrationInWorker: true,
				nodeIntegrationInSubFrames: true,
				preload: this.settings.get('script'),
				enableRemoteModule: true, // Make sure electron.remote is available
				webSecurity: false, // Allow the loading of local resources
				scrollBounce: true, // Enables scroll bounce (rubber banding) effect on macOS, default is false
			},
		});

		// For testing - open dev tools every time
		electronBrowserWindow.webContents.openDevTools();

		// Remove the default menu
		electronBrowserWindow.setMenu(null);

		// Load an empty page which will trigger the running of the preload script which is index.cjs
		var appElectronHtmlPath = Node.Path.join(app.path, 'electron.html')
		// app.log('appElectronHtmlPath', appElectronHtmlPath);
		electronBrowserWindow.loadFile(appElectronHtmlPath);

		// Using data URLs with baseURLForDataURL causes Electron to crash:
		// https://github.com/electron/electron/issues/20700
		// Will use an empty index.html while we wait for this to get fixed
		// var baseURLForDataURL = 'file://'+app.path+'/';
		// app.log('baseURLForDataURL', baseURLForDataURL);
		// electronBrowserWindow.loadURL(
		// 	'data:text/html,<!DOCTYPE html><html><head></head><body></body></html>',
		// 	{
		// 		baseURLForDataURL: baseURLForDataURL,
		// 	}
		// );

		return electronBrowserWindow;
	}

	setBrowserWindowState(electronBrowserWindow, graphicalInterfaceState, updateDimensionsAndPosition = true) {
		if(graphicalInterfaceState.title) {
			electronBrowserWindow.setTitle(graphicalInterfaceState.title);
		}

		if(updateDimensionsAndPosition) {
			//console.info('updateDimensionsAndPosition', 'graphicalInterfaceState', graphicalInterfaceState);

			electronBrowserWindow.setBounds({
				x: Math.floor(graphicalInterfaceState.position.relativeToAllDisplays.x),
				y: Math.floor(graphicalInterfaceState.position.relativeToAllDisplays.y),
				width: Math.floor(graphicalInterfaceState.dimensions.width),
				height: Math.floor(graphicalInterfaceState.dimensions.height),
			});
		}

		// Show
		//console.log('graphicalInterfaceState', 'graphicalInterfaceState);
		if(graphicalInterfaceState.show) {
			electronBrowserWindow.show();
		}
		
		// Open developer tools
		if(graphicalInterfaceState.openDeveloperTools) {
			electronBrowserWindow.openDevTools();
		}
	}

	getCurrentWindow() {
		return this.electron.remote.getCurrentWindow();
	}

	getCurrentWebContents() {
		return this.electron.remote.getCurrentWebContents();
	}

	getDisplays() {
		var displays = {};

		// Get the displays
		var electronScreens = null;
		// Directly access the screen object if in the Electron main process
		if(this.inElectronMainProcess()) {
			electronScreens = this.electron.screen.getAllDisplays();	
		}
		// Use remote if not in the main process
		else {
			electronScreens = this.electron.remote.screen.getAllDisplays();	
		}
		//console.info('electronScreens', electronScreens);

		electronScreens.each(function(electronDisplayIndex, electronDisplay) {
			var display = new Display();

			display.identifier = electronDisplayIndex + 1;
			
			// Dimensions
			display.dimensions.width = electronDisplay.size.width;
			display.dimensions.height = electronDisplay.size.height;

			// Work area dimensions
			display.workAreaDimensions.width = electronDisplay.workArea.width;
			display.workAreaDimensions.height = electronDisplay.workArea.height;

			// Position relative to all displays
			display.position.relativeToAllDisplays.x = electronDisplay.bounds.x;
			display.position.relativeToAllDisplays.y = electronDisplay.bounds.y;

			// Work area relative to all displays
			display.position.workAreaRelativeToAllDisplays.x = electronDisplay.workArea.x;
			display.position.workAreaRelativeToAllDisplays.y = electronDisplay.workArea.y;

			// Scale factor
			display.scaleFactor = electronDisplay.scaleFactor;

			// Rotation
			display.rotation = electronDisplay.rotation;

			// Touch support
			display.touchSupport = electronDisplay.touchSupport;

			displays[display.identifier] = display;
		});

		return displays;
	}

	inElectronEnvironment() {
		var inElectronEnvironment = false;

		if(Node.Process.versions && Node.Process.versions.electron) {
			inElectronEnvironment = true;
		}

		return inElectronEnvironment;
	}

	inElectronMainProcess() {
		var inElectronMainProcess = false;

		if(this.inElectronEnvironment() && Node.Process.type !== 'renderer') {
			inElectronMainProcess = true;
		}

		return inElectronMainProcess;
	}

	inElectronRendererProcess() {
		var inElectronRendererProcess = false;

		if(this.inElectronEnvironment() && Node.Process.type === 'renderer') {
			inElectronRendererProcess = true;
		}

		return inElectronRendererProcess;
	}

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
export { ElectronModule };

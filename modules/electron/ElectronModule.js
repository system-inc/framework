// Dependencies
import Module from 'framework/system/module/Module.js';
import Version from 'framework/system/version/Version.js';
import Directory from 'framework/system/file-system/Directory.js';
import ElectronGraphicalInterfaceAdapter from 'framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js';
import Display from 'framework/system/interface/graphical/Display.js';
import Url from 'framework/system/web/Url.js';

// Class
class ElectronModule extends Module {

	electron = null;

	firstBrowserWindow = null;

	version = new Version('0.1.0');

	defaultSettings = {
		automaticallyStartElectronIfNotInElectronContext: true,
		pathToStartingJavaScriptFile: Node.Path.join(app.directory, 'index.js'),
		quitWhenAllWindowsClosedOnMacOs: false,
	};

	async initialize() {
		await super.initialize(...arguments);

		// If in the Electron context
		if(this.inElectronContext()) {
			//console.warn('In Electron, configuring ElectronModule');
			this.electron = (await import('electron'));
			//console.log('this.electron', this.electron);

			// If in the Electron main process
			if(this.inElectronMainProcess()) {
				// The Electron main process is responsible for starting the first web browser window when there are no other windows
				// The Electron main process does not communicate between windows
				//console.log('Now in Electron Main Process');
				//console.warn('In Electron Main Process, configureElectronMainProcess');
				this.configureElectronMainProcess();
			}
			// If in the Electron renderer process
			else if(this.inElectronRendererProcess()) {
				//console.log('In Electron Renderer Process, configureElectronRendererProcess');
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
			pathToElectronExecutable = (await import(pathToElectronModule)).default;
			//app.log('pathToElectronExecutable', pathToElectronExecutable);
		}

		// Check for Windows Subsystem for Linux
		if(!pathToElectronExecutable) {
			if(await Directory.exists('/mnt/c/Program Files/Electron/')) {
				pathToElectronExecutable = '/mnt/c/Program Files/Electron/electron.exe';	
			}
		}

		// Just use electron as the default if we don't have anything
		if(!pathToElectronExecutable) {
			pathToElectronExecutable = 'electron';
		}

		return pathToElectronExecutable;
	}

	async startElectron() {
		//console.log('ElectronModule', 'startElectron');

		// Get the path to the Electron executable
		var pathToElectronExecutable = await this.getPathToElectronExecutable();
		//app.log('pathToElectronExecutable', pathToElectronExecutable);

		// Get the path to the Electron starting JavaScript file from settings
		var pathToStartingJavaScriptFile = this.settings.get('pathToStartingJavaScriptFile');
		
		// Check for Windows Subsystem for Linux
		if(pathToStartingJavaScriptFile.startsWith('/mnt/c/')) {
			pathToStartingJavaScriptFile = pathToStartingJavaScriptFile.replaceFirst('/mnt/c/', 'c:/');
		}

		//app.log('pathToStartingJavaScriptFile', pathToStartingJavaScriptFile);

		// Pass arguments from node to the Electron main process
		var electronMainProcessArguments = ['--js-flags=--harmony', pathToStartingJavaScriptFile];
		electronMainProcessArguments.merge(Node.Process.argv.slice(2));
		//console.log('Node.Process.argv', Node.Process.argv);
		//console.log('electronMainProcessArguments', electronMainProcessArguments);
		//Node.exit();

		// Run Electron as a child process, providing a .js file runs the file in the Electron main process, providing a .html file runs it in a renderer process
		// We want to run in the main process to take advantage of shared standard streams, so we provide a .js file by default
		//console.log('pathToElectronExecutable', pathToElectronExecutable);
		//console.log('electronMainProcessArguments', electronMainProcessArguments);
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
		//app.log('ElectronModule', 'configureElectronMainProcess');

		// Enable Harmony for any Electron renderer processes we create, will eventually not need to do this
		this.electron.app.commandLine.appendSwitch('--js-flags', '--harmony');

		// Before app.exit() exits the application, quit the Electron app
		app.on('app.beforeExit', function() {
			//app.log('app.beforeQuit');

			this.electron.app.quit();
		}.bind(this));
		
		// When the app is activated from the macOS dock
		this.electron.app.on('activate', function () {
			//app.log('electron app activate');
			//app.log('this', this);

			if(this.firstBrowserWindow === null) {
				//app.log('this.firstBrowserWindow proxy is null');
				this.createFirstBrowserWindow();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		this.electron.app.on('window-all-closed', function () {
			//app.log('electron app window-all-closed');
			//app.log('quitWhenAllWindowsClosedOnMacOs', this.settings.get('quitWhenAllWindowsClosedOnMacOs'));

			if(!app.onMacOs() || this.settings.get('quitWhenAllWindowsClosedOnMacOs')) {
				this.electron.app.quit()
			}
		}.bind(this));

		// Create the first browser window when the app is ready
		if(this.electron.app.isReady()) {
			//console.log('app is ready');
			this.createFirstBrowserWindow();
		}
		// If the app is not ready, wait for the ready event
		else {
			//console.log('app is not ready');
			this.electron.app.on('ready', function () {
				this.createFirstBrowserWindow();
			}.bind(this));
		}
	}

	configureElectronRendererProcess() {
		// Catch unhandled rejections in Electron renderer windows
		window.addEventListener('unhandledrejection', function(error, promise) {
			//console.log(this.electron.remote.getCurrentWindow());

			// Maximize the window
			//this.electron.remote.getCurrentWindow().maximize();

			// Open the developer tools
			this.electron.remote.getCurrentWindow().openDevTools();

			// Log the error
			console.error(error.reason.stack.toString());
		}.bind(this));

		// Update the command with the command from the Electron main process
		var electronMainProcessArguments = this.electron.remote.getGlobal('process').argv;
		//console.info('electronMainProcessArguments', electronMainProcessArguments);
		app.interfaces.commandLine.initializeCommand(electronMainProcessArguments);
		//console.info('app.interfaces.commandLine', app.interfaces.commandLine);

		// Clear the default application menu and all of its shortcuts / accelerators
        this.electron.remote.Menu.setApplicationMenu(null);
	}

	async createFirstBrowserWindow() {
		var pathToStartingJavaScriptFile = this.settings.get('pathToStartingJavaScriptFile');
		console.log('Creating first Electron BrowserWindow', 'pathToStartingJavaScriptFile', pathToStartingJavaScriptFile);

		// Use the ElectronGraphicalInterfaceAdapter to create a new graphical interface
		this.firstBrowserWindow = await this.newBrowserWindow({
			path: pathToStartingJavaScriptFile,
		});

		// When graphical interface is closed
		this.firstBrowserWindow.on('closed', function(event) {
			//console.log('this.firstBrowserWindow.on closed');

			// Dereference the object so it will be recreated on activation (when the user presses the icon on the macOS dock)
			this.firstBrowserWindow = null;
		}.bind(this));

		return this.firstBrowserWindow;
	}

	async newBrowserWindow(options = {
		path: null,
		graphicalInterfaceState: null,
	}) {
		// Set the defaults for graphical interface state
		if(!options.graphicalInterfaceState) {
			options.graphicalInterfaceState = {
				dimensions: {
					width: null,
					height: null,
				},
				position: {
					relativeToAllDisplays: {
						x: null,
						y: null,
					},
				},
				show: false, // Do not show the window at first, wait for it to be set to the right dimensions and position
			};
		};
		console.log('newBrowserWindow', options);

		// Get the right reference for ElectronBrowserWindow based on whether or not we are in the Electron main process or in a renderer process
		var ElectronBrowserWindow = null;
		var parentIdentifier = null;

		// Electron main process
		if(this.inElectronMainProcess()) {
			//console.log('inElectronMainProcess');
			
			ElectronBrowserWindow = this.electron.BrowserWindow;
		}
		// Electron renderer process
		else if(this.inElectronRendererProcess()) {
			//console.log('inElectronRendererProcess');

			ElectronBrowserWindow = this.electron.remote.BrowserWindow;
			parentIdentifier = app.interfaces.graphical.identifier;
		}

		// Disable security warnings in Electron
		Node.Process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = true;
		
		// Create the Electron browser window
		var electronBrowserWindow = new ElectronBrowserWindow({
			title: app.title,
			//parent: (app.interfaces.graphical) ? app.interfaces.graphical.adapter.electronBrowserWindow : null, // this always makes the brower window show
			width: options.graphicalInterfaceState.dimensions.width,
			height: options.graphicalInterfaceState.dimensions.height,
			x: options.graphicalInterfaceState.position.relativeToAllDisplays.x,
			y: options.graphicalInterfaceState.position.relativeToAllDisplays.y,
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: options.graphicalInterfaceState.show,
			webPreferences: {
				webSecurity: false,
				nodeIntegration: true, // Must have this on as it is off by default
				scrollBounce: true, // Enables scroll bounce (rubber banding) effect on macOS, default is false
			},
		});

		// For testing - open dev tools every time
		//electronBrowserWindow.webContents.openDevTools();

		// Remove the default menu
		electronBrowserWindow.setMenu(null);

		// Optionally load the path
		if(options.path !== null) {
			this.navigateBrowserWindowToPath(electronBrowserWindow, options.path)
		}

		return electronBrowserWindow;
	}

	async navigateBrowserWindowToPath(electronBrowserWindow, path = null) {
		if(path === null) {
			throw new Error('Must specify a path to a JavaScript file to load.');
		}

		// Create a JavaScript string to start the app, this is the same as index.js in framework/app/index.js
		var transpilerPath = Node.Path.join(app.framework.directory.toString(), 'globals', 'Transpiler.js');
		//app.log('transpilerPath', transpilerPath);
		var directoryContainingFramework = Node.Path.join(app.framework.directory.toString(), '../');
		//app.log('directoryContainingFramework', directoryContainingFramework);

		// Escape backslashes
		path = path.replace('\\', '\\\\');
		transpilerPath = transpilerPath.replace('\\', '\\\\');
		directoryContainingFramework = directoryContainingFramework.replace('\\', '\\\\');

		// The script string
		var script = "require('"+transpilerPath+"').execute('"+path+"', __dirname, '"+directoryContainingFramework+"');";
		//app.log('script', script);

		var htmlString = 'data:text/html,<!DOCTYPE html><html><head><script>'+script+'</script></head><body></body></html>';
		//console.log('htmlString', htmlString);
		
		var baseUrlForDataUrl = new Url(app.directory.toString()).toString();
		//console.log('baseURLForDataURL', baseUrlForDataUrl);
		console.warn('baseURLForDataURL broken and crashes Electron, need to use base tag to pass all tests? https://github.com/electron/electron/issues/18472');

		// Load the string
		electronBrowserWindow.loadURL(htmlString, {
			// This currently crashes Electron
			//baseURLForDataURL: baseUrlForDataUrl, // String (optional) - Base url (with trailing path separator) for files to be loaded by the data url. This is needed only if the specified url is a data url and needs to load other files.
		});

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

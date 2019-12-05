// Dependencies
import Module from 'framework/system/module/Module.js';
import Version from 'framework/system/version/Version.js';
import Directory from 'framework/system/file-system/Directory.js';
import ElectronGraphicalInterfaceAdapter from 'framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js';
import Display from 'framework/system/interface/graphical/Display.js';

// Class
class ElectronModule extends Module {

	electron = null;

	firstGraphicalInterface = null;

	version = new Version('0.1.0');

	defaultSettings = {
		automaticallyStartElectronIfNotInElectronContext: true,
		pathToElectronStartingJavaScriptFile: Node.Path.join(app.directory, 'index.js'),
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
		var pathToElectronStartingJavaScriptFile = this.settings.get('pathToElectronStartingJavaScriptFile');
		
		// Check for Windows Subsystem for Linux
		if(pathToElectronStartingJavaScriptFile.startsWith('/mnt/c/')) {
			pathToElectronStartingJavaScriptFile = pathToElectronStartingJavaScriptFile.replaceFirst('/mnt/c/', 'c:/');
		}

		//app.log('pathToElectronStartingJavaScriptFile', pathToElectronStartingJavaScriptFile);

		// Pass arguments from node to the Electron main process
		var electronMainProcessArguments = ['--js-flags=--harmony', pathToElectronStartingJavaScriptFile];
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

			if(this.firstGraphicalInterface === null) {
				//app.log('this.firstGraphicalInterface proxy is null');
				this.newGraphicalInterface();
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

		// Create the first graphical interface when the app is ready
		if(this.electron.app.isReady()) {
			//console.log('app is ready');
			this.newGraphicalInterface();
		}
		// If the app is not ready, wait for the ready event
		else {
			//console.log('app is not ready');
			this.electron.app.on('ready', function () {
				this.newGraphicalInterface();
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

	async newGraphicalInterface() {
		var pathToElectronStartingJavaScriptFile = this.settings.get('pathToElectronStartingJavaScriptFile');
		console.log('Creating a new Electron graphical interface', 'pathToElectronStartingJavaScriptFile', pathToElectronStartingJavaScriptFile);

		// Use the ElectronGraphicalInterfaceAdapter to create a new graphical interface
		this.firstGraphicalInterface = await ElectronGraphicalInterfaceAdapter.newGraphicalInterface({
			path: pathToElectronStartingJavaScriptFile,
		});

		// When graphical interface is closed
		this.firstGraphicalInterface.on('graphicalInterface.closed', function () {
			//app.log('this.firstGraphicalInterface.on closed');

			// Dereference the object so it will be recreated on activation (when the user presses the icon on the macOS dock)
			this.firstGraphicalInterface = null;
		}.bind(this));

		return this.firstGraphicalInterface;
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

// Dependencies
import Module from 'framework/system/module/Module.js';
import Version from 'framework/system/version/Version.js';
import Directory from 'framework/system/file-system/Directory.js';
import ElectronGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/electron/ElectronGraphicalInterfaceAdapter.js';
import Display from 'framework/system/interface/graphical/Display.js';

// Class
class ElectronModule extends Module {

	electron = null;

	firstGraphicalInterfaceProxy = null;

	version = new Version('0.1.0');

	defaultSettings = {
		automaticallyStartElectronIfNotInElectronContext: true,
		pathToElectronStartingJavaScriptFile: Node.Path.join(app.directory, 'index.js'),
		pathToFirstBrowserWindowHtmlFile: Node.Path.join(app.directory, 'index.html'),
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
			//console.warn('Not in Electron, starting Electron...');
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

		// Run Electron as a child process, providing a .js file runs the file in the Electron main process, providing a .html file runs it in a renderer process
		// We want to run in the main process to take advantage of shared standard streams, so we provide a .js file by default
		var childProcessElectronMainProcess = Node.spawnChildProcess(pathToElectronExecutable, ['--js-flags=--harmony', pathToElectronStartingJavaScriptFile, 'gi'], {});

		// The parent process I am in now exists to just to as a bridge for standard streams to the child process which is the Electron main process

		// So, I remove all listeners from the parent process standard input stream
		Node.Process.stdin.removeAllListeners();

		// And send all standard input to the child process
		Node.Process.stdin.on('data', function(data) {
			childProcessElectronMainProcess.stdin.write(data);
		});

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

	configureElectronMainProcess() {
		// Enable Harmony for any Electron renderer processes we create, will eventually not need to do this
		this.electron.app.commandLine.appendSwitch('--js-flags', '--harmony');

		// When the app is activated from the macOS dock
		this.electron.app.on('activate', function () {
			if(this.firstGraphicalInterfaceProxy === null) {
				this.newGraphicalInterface();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		this.electron.app.on('window-all-closed', function () {
			if(!app.onMacOs()) {
				this.electron.app.quit()
			}
		});

		// Create the first graphical interface
		this.newGraphicalInterface();	
	}

	newGraphicalInterface() {
		// Use the ElectronGraphicalInterfaceAdapter to create a new graphical interface
		this.firstGraphicalInterfaceProxy = ElectronGraphicalInterfaceAdapter.newGraphicalInterface(this.settings.get('pathToFirstBrowserWindowHtmlFile'));
		
		// When graphical interface is closed
		this.firstGraphicalInterfaceProxy.sourceGraphicalInterface.on('closed', function () {
			// Dereference the object so it will be recreated on activation (when the user presses the icon on the macOS dock)
			this.firstGraphicalInterfaceProxy = null;
		}.bind(this));
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
			console.error('(correct trace below)', error.reason.toString());
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
	
}

// Export
export default ElectronModule;

// Dependencies
import { WebGraphicalInterfaceAdapter } from '@framework/system/interface/graphical/adapters/web/WebGraphicalInterfaceAdapter.js';
import { GraphicalInterfaceState } from '@framework/system/interface/graphical/GraphicalInterfaceState.js';

// Class
class ElectronGraphicalInterfaceAdapter extends WebGraphicalInterfaceAdapter {

	path = null;
	electronBrowserWindow = null;
	macOsApplicationMenu = null;

	async initialize() {
		// If initializing into an existing Electron BrowserWindow
		if(this.graphicalInterface.usesPreexistingAdapter) {
			// console.log('Using an existing Electron BrowserWindow...');

			// Set the GraphicalInterface identifier if it was passed in the URL
			// console.log('document.location.search', document.location.search);
			if(document.location.search.startsWith('?graphicalInterfaceIdentifier=')) {
				this.graphicalInterface.identifier = document.location.search.replace('?graphicalInterfaceIdentifier=', '');
				// console.log('GraphicalInterface identifier provided, updated to:', this.graphicalInterface.identifier);
			}

			// Initialize the WebGraphicalInterfaceAdapter
			await super.initialize();
			
			// Reference the current window
			// this.electronBrowserWindow = app.modules.electronModule.getCurrentWindow();

			// Listen to Electron display events
			this.listenToElectronDisplayEvents();
		}
		// Create a new Electron BrowserWindow if not initializing into an existing one
		else {
			// console.log('Creating a new Electron BrowserWindow...');

			// Create a new Electron BrowserWindow
			this.electronBrowserWindow = await app.modules.electronModule.newBrowserWindow(this.graphicalInterface.type, {
				graphicalInterfaceIdentifier: this.graphicalInterface.identifier,
				url: this.graphicalInterface.url,
			});

			// Listen to close events
			this.listenToElectronBrowserWindowCloseEvents();
		}

		// Debug
		if(this.graphicalInterface.parent !== null) {
			console.log('Child graphical interface identifier:', this.graphicalInterface.identifier);
		}
		else {
			console.log('This graphical interface identifier:', this.graphicalInterface.identifier);
		}

		// Establish the broadcast channel to listen to events from the BrowserWindow
		this.establishBroadcastChannel();

		// Initialize the state
		await this.initializeState();

		return this;
	}

	listenToElectronDisplayEvents() {
		return;

		// Get the Electron screen 
		let ElectronScreen = app.modules.electronModule.electron.remote.screen;
		// app.log('ElectronScreen', ElectronScreen);

		// Display added
		ElectronScreen.on('display-added', function(event, newDisplay) {
			console.info('display-added', event);
			this.graphicalInterface.emit('display.added', arguments, {
				// Do not bubble this event as the parent will get notified by it's own event listener
				propagationStopped: true,
			});
		}.bind(this));

		// Display removed
		ElectronScreen.on('display-removed', function(event, oldDisplay) {
			console.info('display-removed', event);
			this.graphicalInterface.emit('display.removed', arguments, {
				// Do not bubble this event as the parent will get notified by it's own event listener
				propagationStopped: true,
			});
		}.bind(this));

		// Display metrics changed
		ElectronScreen.on('display-metrics-changed', function(event, display, changedMetrics) {
			console.info('display-metrics-changed', event);
			this.graphicalInterface.emit('display.changed', arguments, {
				// Do not bubble this event as the parent will get notified by it's own event listener
				propagationStopped: true,
			});
		}.bind(this));
	}

	listenToElectronBrowserWindowCloseEvents() {
		// When the Electron BrowserWindow will close
		this.electronBrowserWindow.on('close', function(event) {
			console.log('electronBrowserWindow close', this.graphicalInterface);
			this.graphicalInterface.emit('graphicalInterface.close', event, {
				propagationStopped: true, // Do not bubble this event
			});
		}.bind(this));

		// When the Electron BrowserWindow is closed
		this.electronBrowserWindow.on('closed', function(event) {
			console.log('electronBrowserWindow closed', this.graphicalInterface);
			this.graphicalInterface.state.closed = true;
			this.graphicalInterface.emit('graphicalInterface.closed', event, {
				propagationStopped: true, // Do not bubble this event
			});
			
		}.bind(this));
	}

	async initializeState(setBrowserWindowState = true) {
		await this.initializeDisplays();

		this.graphicalInterface.state = ElectronGraphicalInterfaceAdapter.constructGraphicalInterfaceState(this.graphicalInterface.type, this.graphicalInterface.displays);
		// console.info('this.graphicalInterface.state', this.graphicalInterface.state);

		// Store a reference to the graphical interface on the state
		this.graphicalInterface.state.graphicalInterface = this.graphicalInterface;

		// TODO: The last argument here should be false because we don't need to initialize state because we already set the x, y, width, and height
		// but for some reason there are issues with the height that are fixed when calling it afterwards
		if(setBrowserWindowState) {
			// app.modules.electronModule.setBrowserWindowState(this.electronBrowserWindow, this.graphicalInterface.state, true);
		}

		return this.graphicalInterface.state;
	}

	async initializeDisplays() {
		//console.log('ElectronGraphicalInterfaceAdapter initializeDisplays');
		this.graphicalInterface.displays = app.modules.electronModule.getDisplays();
		this.graphicalInterface.display = this.graphicalInterface.displays[1];

		return this.graphicalInterface.displays;
	}

	close() {
		//console.info('close');
		this.electronBrowserWindow.close();
	}

	destroy() {
		this.electronBrowserWindow.destroy();
	}

	show() {
		//console.info('show');
		this.electronBrowserWindow.show();
	}

	openDeveloperTools() {
		//console.info('openDeveloperTools');
		this.electronBrowserWindow.openDevTools();
	}

	closeDeveloperTools() {
		//console.info('openDeveloperTools');
		this.electronBrowserWindow.closeDevTools();
	}

	toggleDeveloperTools() {
		//console.info('openDeveloperTools');
		this.electronBrowserWindow.toggleDevTools();
	}

	reload() {
		this.electronBrowserWindow.reload();
	}

	reset() {
		console.warn('Clearing all storage data...');
		this.electronBrowserWindow.webContents.session.clearStorageData(
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
	}

	getMacOsApplicationMenu() {
		return this.macOsApplicationMenu;
	}

	setMacOsApplicationMenu(macOsApplicationMenu) {
		this.macOsApplicationMenu = macOsApplicationMenu;

		return this.macOsApplicationMenu;
	}

	async inputKeyDown(key, modifiers = []) {
		return await app.modules.electronModule.inputKeyDown(key, modifiers = []);
	}

	async inputKeyUp(key, modifiers = []) {
		return await app.modules.electronModule.inputKeyUp(key, modifiers = []);
	}

	async inputKeyPress(key, modifiers = []) {
		return await app.modules.electronModule.inputKeyPress(key, modifiers = []);
	}
	
	async inputKeyPressByCombination(key, modifiers = []) {
		return await app.modules.electronModule.inputKeyPressByCombination(key, modifiers = []);
	}

	async inputPress() {
		
	}

	async inputPressView(view, button = 'left', pressCount = 1, modifiers = []) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;
		//var viewPosition = view.position;
		//console.info('viewPosition', viewPosition);

		return await app.modules.electronModule.inputPress(Number.round(viewPosition.x), Number.round(viewPosition.y), button, pressCount, modifiers);
	}

	async inputPressDoubleView(view, button = 'left', pressCount = 2, modifiers = []) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;
		//var viewPosition = view.position;
		//console.info('viewPosition', viewPosition);

		return await app.modules.electronModule.inputPress(Number.round(viewPosition.x), Number.round(viewPosition.y), button, 2, modifiers);
	}

	async inputHover(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY) {
		return await app.modules.electronModule.inputHover(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY);
	}

	async inputHoverView(view) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;

		return await this.inputHover(Number.round(viewPosition.x), Number.round(viewPosition.y));
	}

	async inputScroll() {

	}

	async inputScrollView(view, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers = []) {
		var viewPosition = view.getPosition();

		return await app.modules.electronModule.inputScroll(Number.round(viewPosition.relativeToGraphicalInterfaceViewport.x), Number.round(viewPosition.relativeToGraphicalInterfaceViewport.y),  deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers);
	}

	static constructGraphicalInterfaceState(type = null, displays = null) {
		// console.log('constructGraphicalInterfaceState', type, displays);

		// Get the displays
		if(displays === null) {
			displays = app.modules.electronModule.getDisplays();
		}
		// app.info('displays', displays);

		var graphicalInterfaceStateSettings = GraphicalInterfaceState.getSettingsWithDisplays(type, displays);
		// console.info('graphicalInterfaceStateSettings', graphicalInterfaceStateSettings);

		// Construct the state for the graphical interface
		var graphicalInterfaceState = GraphicalInterfaceState.fromSettingsWithDisplays(graphicalInterfaceStateSettings, displays, type);
		// console.info('graphicalInterfaceState', graphicalInterfaceState);

		return graphicalInterfaceState;
	}

}

// Export
export { ElectronGraphicalInterfaceAdapter };

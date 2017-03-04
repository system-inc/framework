// Dependencies
import WebGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/web/WebGraphicalInterfaceAdapter.js';
import Electron from 'electron';
import ElectronManager from 'framework/system/interface/graphical/electron/ElectronManager.js';
import GraphicalInterfaceProxy from 'framework/system/interface/graphical/GraphicalInterfaceProxy.js';
import GraphicalInterfaceState from 'framework/system/interface/graphical/GraphicalInterfaceState.js';
import Url from 'framework/system/web/Url.js';
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class ElectronGraphicalInterfaceAdapter extends WebGraphicalInterfaceAdapter {

	electronBrowserWindow = null;

	constructor(graphicalInterface) {
		super(graphicalInterface);

		this.electronBrowserWindow = Electron.remote.getCurrentWindow();

		this.graphicalInterface.identifier = this.electronBrowserWindow.id;
	}

	async newGraphicalInterface(options = {}) {
		var graphicalInterfaceProxy = await ElectronGraphicalInterfaceAdapter.newGraphicalInterface(options);

		return graphicalInterfaceProxy;
	}

	initializeDisplays() {
		//console.log('ElectronGraphicalInterfaceAdapter initializeDisplays');
		this.graphicalInterface.displays = app.modules.electronModule.getDisplays();
		this.graphicalInterface.display = this.graphicalInterface.displays[1];

		return this.graphicalInterface.displays;
	}

	initializeState() {
		this.graphicalInterface.state = GraphicalInterfaceState.constructFromElectronBrowserWindow(this.electronBrowserWindow);
		//console.info('this.graphicalInterface.state', this.graphicalInterface.state);

		// TODO: Update state on electron window change

		return this.graphicalInterface.state;
	}

	broadcast(key, value) {
		LocalStorage.set('app.interfaces.graphical.'+this.graphicalInterface.identifier+'.'+key, value);
	}

	async inputKeyPressByCombination(key, modifiers = []) {
		return await ElectronManager.inputKeyPressByCombination(key, modifiers = []);
	}

	async inputKeyDown(key, modifiers = []) {
		return await ElectronManager.inputKeyDown(key, modifiers = []);
	}

	async inputKeyUp(key, modifiers = []) {
		return await ElectronManager.inputKeyUp(key, modifiers = []);
	}

	async inputKeyPress(key, modifiers = []) {
		return await ElectronManager.inputKeyPress(key, modifiers = []);
	}

	async inputPress() {
		
	}

	async inputPressView(view, button = 'left', pressCount = 1, modifiers = []) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;
		//var viewPosition = view.position;
		//console.info('viewPosition', viewPosition);

		return await ElectronManager.inputPress(Number.round(viewPosition.x), Number.round(viewPosition.y), button, pressCount, modifiers);
	}

	async inputPressDoubleView(view, button = 'left', pressCount = 2, modifiers = []) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;
		//var viewPosition = view.position;
		//console.info('viewPosition', viewPosition);

		return await ElectronManager.inputPress(Number.round(viewPosition.x), Number.round(viewPosition.y), button, 2, modifiers);
	}

	async inputHover(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY) {
		return await ElectronManager.inputHover(relativeToGraphicalInterfaceViewportX, relativeToGraphicalInterfaceViewportY);
	}

	async inputHoverView(view) {
		var viewPosition = view.position.relativeToGraphicalInterfaceViewport;

		return await this.inputHover(Number.round(viewPosition.x), Number.round(viewPosition.y));
	}

	async inputScroll() {

	}

	async inputScrollView(view, deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers = []) {
		var viewPosition = view.getPosition();

		return await ElectronManager.inputScroll(Number.round(viewPosition.relativeToGraphicalInterfaceViewport.x), Number.round(viewPosition.relativeToGraphicalInterfaceViewport.y),  deltaX, deltaY, wheelTicksX, wheelTicksY, accelerationRatioX, accelerationRatioY, hasPreciseScrollingDeltas, canScroll, modifiers);
	}

	static async newGraphicalInterface(options) {
		var path = null;
		if(options.path) {
			path = options.path;
		}

		var type = null;
		if(options.type) {
			type = options.type;
		}

		// Get the right reference for ElectronBrowserWindow based on whether or not we are in the Electron main process or in a renderer process
		var ElectronBrowserWindow = null;
		var parentIdentifier = null;

		// Electron main process
		if(app.modules.electronModule.inElectronMainProcess()) {
			ElectronBrowserWindow = Electron.BrowserWindow;
		}
		// Electron renderer process
		if(app.modules.electronModule.inElectronRendererProcess()) {
			ElectronBrowserWindow = Electron.remote.BrowserWindow;
			parentIdentifier = app.interfaces.graphical.identifier;
		}

		// Get the settings
		var graphicalInterfaceStateSettings = GraphicalInterfaceState.getSettings(type);
		//console.info('graphicalInterfaceStateSettings', graphicalInterfaceStateSettings);

		// Get the displays
		var displays = app.modules.electronModule.getDisplays();
		//app.info('displays', displays);

		// Construct the state for the graphical interface
		var graphicalInterfaceState = GraphicalInterfaceState.constructFromSettingsWithDisplays(graphicalInterfaceStateSettings, displays);
		//app.info('graphicalInterfaceState', graphicalInterfaceState);

		// Create the Electron browser window
		var electronBrowserWindow = new ElectronBrowserWindow({
			//url: app.directory.toString(),
			title: app.title,
			parent: (app.interfaces.graphical) ? app.interfaces.graphical.adapter.electronBrowserWindow : null,
			width: graphicalInterfaceState.dimensions.width,
			height: graphicalInterfaceState.dimensions.height,
			x: graphicalInterfaceState.position.relativeToAllDisplays.x,
			y: graphicalInterfaceState.position.relativeToAllDisplays.y,
			webPreferences: {
				scrollBounce: true, // Enables scroll bounce (rubber banding) effect on macOS, default is false
			},
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: graphicalInterfaceStateSettings.show,
		});

		var graphicalInterfaceProxy = new GraphicalInterfaceProxy(electronBrowserWindow.id, parentIdentifier);

		electronBrowserWindow.on('closed', function() {
			graphicalInterfaceProxy.emit('graphicalInterface.closed');
		});

		electronBrowserWindow.on('show', function() {
			graphicalInterfaceProxy.emit('graphicalInterface.show');
		});

		// This approach doesn't work when electronBrowserWindow is over remote
		// Patch the Electron BrowserWindow event emitter to make the GraphicalInterfaceProxy emit the events as well
		//var standardElectronBrowserWindowEmit = electronBrowserWindow.emit;
		//electronBrowserWindow.emit = function() {
		//	var eventIdentifier = 'graphicalInterface.'+arguments[0].toCamelCase();
		//	//console.log('eventIdentifier', eventIdentifier);
		//	graphicalInterfaceProxy.emit(eventIdentifier, arguments[1]);

		//	//console.log('electronBrowserWindow emit', arguments);
		//	standardElectronBrowserWindowEmit.apply(electronBrowserWindow, arguments);
		//};

		// Load an empty page, we use the webPreferences preload open to load FrameworkApp
		// TODO: newGraphicalInterface with strings instead of files: https://github.com/electron/electron/issues/8735 and https://app.asana.com/0/35428325799561/283058472623355
		var appHtmlFileUrl = new Url(path);
		electronBrowserWindow.loadURL(appHtmlFileUrl.toString());

		// Debugging - comment out the lines below when ready for release
		electronBrowserWindow.openDevTools(); // Comment out for production

		return graphicalInterfaceProxy;
	}

}

// Export
export default ElectronGraphicalInterfaceAdapter;

// Dependencies
import WebGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/web/WebGraphicalInterfaceAdapter.js';
import Electron from 'electron';
import ElectronManager from 'framework/system/interface/graphical/electron/ElectronManager.js';
import GraphicalInterfaceProxy from 'framework/system/interface/graphical/GraphicalInterfaceProxy.js';
import GraphicalInterfaceState from 'framework/system/interface/graphical/GraphicalInterfaceState.js';
import Url from 'framework/system/web/Url.js';

// Class
class ElectronGraphicalInterfaceAdapter extends WebGraphicalInterfaceAdapter {

	electronBrowserWindow = null;

	constructor(graphicalInterface) {
		super(graphicalInterface);

		this.electronBrowserWindow = Electron.remote.getCurrentWindow();

		this.graphicalInterface.identifier = this.electronBrowserWindow.id;
	}

	newGraphicalInterface() {
		var graphicalInterfaceProxy = ElectronGraphicalInterfaceAdapter.newGraphicalInterface();

		return graphicalInterfaceProxy;
	}

	initializeDisplays() {
		//console.log('ElectronGraphicalInterfaceAdapter initializeDisplays');
		this.graphicalInterface.displays = app.modules.electronModule.getDisplays();
		this.graphicalInterface.display = this.graphicalInterface.displays[1];
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

	static newGraphicalInterface(pathToFirstBrowserWindowHtmlFile, type = 'primary') {
		// Get the right reference for ElectronBrowserWindow based on whether or not we are in the Electron main process or in a renderer process
		var ElectronBrowserWindow = null;

		// Electron main process
		if(app.modules.electronModule.inElectronMainProcess()) {
			ElectronBrowserWindow = Electron.BrowserWindow;
		}
		// Electron renderer process
		if(app.modules.electronModule.inElectronRendererProcess()) {
			ElectronBrowserWindow = Electron.remote.BrowserWindow;
		}

		// Get the displays
		var displays = app.modules.electronModule.getDisplays();
		//app.info('displays', displays);

		// Construct the state for the graphical interface
		var graphicalInterfaceState = GraphicalInterfaceState.constructFromSettingsWithDisplays(displays, type);
		//app.info('graphicalInterfaceState', graphicalInterfaceState);

		// Create the Electron browser window
		var electronBrowserWindow = new ElectronBrowserWindow({
			//url: app.directory.toString(),
			width: graphicalInterfaceState.dimensions.width,
			height: graphicalInterfaceState.dimensions.height,
			x: graphicalInterfaceState.position.relativeToAllDisplays.x,
			y: graphicalInterfaceState.position.relativeToAllDisplays.y,
			webPreferences: {
				scrollBounce: true, // Enables scroll bounce (rubber banding) effect on macOS, default is false
			},
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: true,
		});

		// Load an empty page, we use the webPreferences preload open to load FrameworkApp
		app.error('https://github.com/electron/electron/issues/8735');
		var appHtmlFileUrl = new Url(pathToFirstBrowserWindowHtmlFile);
		electronBrowserWindow.loadURL(appHtmlFileUrl.toString());

		// Debugging - comment out the lines below when ready for release
		electronBrowserWindow.webContents.openDevTools(); // Comment out for production

		var graphicalInterfaceProxy = new GraphicalInterfaceProxy(electronBrowserWindow);

		return graphicalInterfaceProxy;
	}

}

// Export
export default ElectronGraphicalInterfaceAdapter;

// Dependencies
import WebGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/web/WebGraphicalInterfaceAdapter.js';
import GraphicalInterfaceProxy from 'framework/system/interface/graphical/GraphicalInterfaceProxy.js';
import GraphicalInterfaceState from 'framework/system/interface/graphical/GraphicalInterfaceState.js';
import Url from 'framework/system/web/Url.js';
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class ElectronGraphicalInterfaceAdapter extends WebGraphicalInterfaceAdapter {

	electronBrowserWindow = null;

	constructor(graphicalInterface) {
		super(graphicalInterface);

		this.electronBrowserWindow = app.modules.electronModule.getCurrentWindow();

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
		this.graphicalInterface.state = ElectronGraphicalInterfaceAdapter.constructGraphicalInterfaceState(null, this.graphicalInterface.displays);
		//console.info('this.graphicalInterface.state', this.graphicalInterface.state);

		ElectronGraphicalInterfaceAdapter.initializeState(this.electronBrowserWindow, this.graphicalInterface.state);

		return this.graphicalInterface.state;
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

	reload() {
		document.title = '';
		document.location.reload(true);
	}

	reset() {
		app.modules.electronModule.getCurrentWebContents().session.clearStorageData(
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

	static async newGraphicalInterface(options) {
		var path = null;
		if(options.path) {
			path = options.path;
			//console.log('path', path);
		}

		var type = null;
		if(options.type) {
			type = options.type;
		}

		// Get the state
		var graphicalInterfaceState = ElectronGraphicalInterfaceAdapter.constructGraphicalInterfaceState(type);
		//console.log('graphicalInterfaceState', graphicalInterfaceState);

		// Get the right reference for ElectronBrowserWindow based on whether or not we are in the Electron main process or in a renderer process
		var ElectronBrowserWindow = null;
		var parentIdentifier = null;

		// Electron main process
		if(app.modules.electronModule.inElectronMainProcess()) {
			ElectronBrowserWindow = app.modules.electronModule.electron.BrowserWindow;
		}
		// Electron renderer process
		if(app.modules.electronModule.inElectronRendererProcess()) {
			ElectronBrowserWindow = app.modules.electronModule.electron.remote.BrowserWindow;
			parentIdentifier = app.interfaces.graphical.identifier;
		}
		
		// Create the Electron browser window
		var electronBrowserWindow = new ElectronBrowserWindow({
			//url: app.directory.toString(),
			title: app.title,
			//parent: (app.interfaces.graphical) ? app.interfaces.graphical.adapter.electronBrowserWindow : null, // this always makes the brower window show
			width: graphicalInterfaceState.dimensions.width,
			height: graphicalInterfaceState.dimensions.height,
			x: graphicalInterfaceState.position.relativeToAllDisplays.x,
			y: graphicalInterfaceState.position.relativeToAllDisplays.y,
			//icon: __dirname+'/views/images/icons/icon-tray.png', // This only applies to Windows
			show: graphicalInterfaceState.show,
			//show: false,
			webPreferences: {
				scrollBounce: true, // Enables scroll bounce (rubber banding) effect on macOS, default is false
			},
		});

		// Show the window gracefully
		//if(graphicalInterfaceState.show) {
		//	electronBrowserWindow.once('ready-to-show', function() {
		//		electronBrowserWindow.show();
		//	});
		//}

		// Create the graphical interface proxy to return
		var graphicalInterfaceProxy = new GraphicalInterfaceProxy(electronBrowserWindow.id, parentIdentifier);

		// TODO: newGraphicalInterface with strings instead of files: https://github.com/electron/electron/issues/8735 and https://app.asana.com/0/35428325799561/283058472623355
		//var appHtmlFileUrl = new Url(path);
		//electronBrowserWindow.loadURL(appHtmlFileUrl.toString());

		var requirePath = Node.Path.join(app.framework.directory.toString(), 'globals', 'Require.js');
		//console.log('requirePath', requirePath);
		var librariesDirectory = Node.Path.join(app.framework.directory.toString(), '../');
		//console.log('librariesDirectory', librariesDirectory);
		var babelRegisterDirectory = Node.Path.join(app.framework.directory.toString(), 'node_modules', 'babel-register');
		//console.log('babelRegisterDirectory', babelRegisterDirectory);

		// Create a JavaScript string to start the app, this is the same as index.js in framework/app/index.js
		var script = '';
		script += "(function() {																\n";
		script += "var Require = require('"+requirePath+"');									\n";
		script += "Require.addRequirePath('"+app.directory.toString()+"');						\n";
		script += "Require.addRequirePath('"+librariesDirectory+"');							\n";
		
		// Disable the Babel cache for debugging
		//script += "process.env.BABEL_DISABLE_CACHE = 1;											\n";
		
		// Include the Babel polyfill when generator support is not available
		//script += "require('babel-polyfill THIS NEEDS TO BE THE CORRECT PATH');					\n";

		// Integrate transpilation with import statements
		script += "require('"+babelRegisterDirectory+"')({										\n";
		script += "    presets: [																\n";
		//script += "        'latest',															\n";
		//script += "        'stage-0',															\n";
		script += "    ],																		\n";
		script += "    plugins: [																\n";
		script += "        'transform-class-properties',										\n";
		script += "        'transform-es2015-modules-commonjs',									\n";
		script += "    ],																		\n";
		script += "    sourceMaps: 'both',														\n";
		script += "});																			\n";
		script += "																				\n";
		script += "require('"+path+"');															\n";
		script += "})();																		\n";

		var htmlString = 'data:text/html,<!DOCTYPE html><html><head><script>'+script+'</script></head><body></body></html>';

		//console.log('script', script);
		electronBrowserWindow.loadURL(htmlString,
			{
				// String (optional) - Base url (with trailing path separator) for files to be loaded by the data url. This is needed only if the specified url is a data url and needs to load other files.
				baseURLForDataURL: new Url(app.directory.toString()).toString(),
			}
		);

		// Listen to closed events
		electronBrowserWindow.on('closed', function(event) {
			graphicalInterfaceProxy.closed = true;
			graphicalInterfaceProxy.emit('graphicalInterface.closed', event);
		});

		// Initialize the state
		ElectronGraphicalInterfaceAdapter.initializeState(electronBrowserWindow, graphicalInterfaceState, false);

		return graphicalInterfaceProxy;
	}

	static constructGraphicalInterfaceState(type = null, displays = null) {
		// Get the displays
		if(displays === null) {
			displays = app.modules.electronModule.getDisplays();
		}
		//app.info('displays', displays);

		var graphicalInterfaceStateSettings = GraphicalInterfaceState.getSettingsWithDisplays(type, displays);
		//console.info('graphicalInterfaceStateSettings', graphicalInterfaceStateSettings);

		// Construct the state for the graphical interface
		var graphicalInterfaceState = GraphicalInterfaceState.constructFromSettingsWithDisplays(graphicalInterfaceStateSettings, displays, type);
		//console.info('graphicalInterfaceState', graphicalInterfaceState);

		return graphicalInterfaceState;
	}

	static initializeState(electronBrowserWindow, graphicalInterfaceState, updateDimensionsAndPosition = true) {
		if(graphicalInterfaceState.title) {
			electronBrowserWindow.setTitle(graphicalInterfaceState.title);
		}

		if(updateDimensionsAndPosition) {
			//console.info('graphicalInterfaceState', graphicalInterfaceState);

			electronBrowserWindow.setBounds({
				x: graphicalInterfaceState.position.relativeToAllDisplays.x,
				y: graphicalInterfaceState.position.relativeToAllDisplays.y,
				width: graphicalInterfaceState.dimensions.width,
				height: graphicalInterfaceState.dimensions.height,
			});
		}

		// Open developer tools
		if(graphicalInterfaceState.openDeveloperTools) {
			electronBrowserWindow.openDevTools();
		}
	}

}

// Export
export default ElectronGraphicalInterfaceAdapter;

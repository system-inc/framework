// Move this GraphicalInterfaceState?

// Dependencies
import Electron from 'electron';

// Class
class BrowserWindowState {

	identifier = null;
	browserWindow = null;
	settings = null;

	mode = null; // maximized, minimized, normal

	display = null; // The display to show on

	x = null;
	y = null;

	height = null;
	width = null;

	constructor(identifier, browserWindow, settings) {
		this.identifier = identifier;
		this.browserWindow = browserWindow;
		this.settings = settings;

		// If we are to remember the window state
		if(this.settings.remember) {
			this.saveToLocalStorageOnClose();
			this.applyFromLocalStorage();
		}
		// If we are not supposed to remember window state, we use the defaults from settings
		else {
			this.applyDefault();
		}

		// Conditionally apply defaults on screen events
		this.listenToScreenEvents();
	}

	load(browserWindowState) {
		if(!browserWindowState) {
			browserWindowState = this.get();
		}

		this.mode = browserWindowState.mode;
		this.x = browserWindowState.x;
		this.y = browserWindowState.y;
		this.height = browserWindowState.height;
		this.width = browserWindowState.width;
	}

	get() {
		var browserWindowState = {};

		// Mode
		if(this.browserWindow.isMaximized()) {
			browserWindowState.mode = 'maximized';
		}
		else if(this.browserWindow.isMinimized()) {
			browserWindowState.mode = 'minimized';
		}
		else {
			browserWindowState.mode = 'normal';
		}
		
		// Catch full screen mode
		if(this.browserWindow.isFullScreen()) {
			browserWindowState.mode = 'fullScreen';
		}		

		// Bounds
		var bounds = this.browserWindow.getBounds();
		browserWindowState.width = bounds.width;
		browserWindowState.height = bounds.height;
		browserWindowState.x = bounds.x;
		browserWindowState.y = bounds.y;

		return browserWindowState;
	}

	apply() {
		//app.log(this.mode);

		if(this.mode == 'maximized') {
			//app.log('maximizing');
			this.browserWindow.maximize();
		}
		else if(this.mode == 'minimized') {
			//app.log('minimizing');
			this.browserWindow.minimize();
		}
		else if(this.mode == 'fullScreen') {
			//app.log('setting full screen');
			this.browserWindow.setFullScreen(true);
		}

		// Temporary hack to fix Windows 10 browser window sizing issues until Electron is fixed
		// Windows 10 Browser Window Bounds Calculating Incorrectly #4045
		// https://github.com/atom/electron/issues/4045
		if(Node.OperatingSystem.platform() == 'win32' && Node.OperatingSystem.release().startsWith('10.')) {
			this.x = this.x - 7;
			this.width = this.width + 14;
			this.height = this.height + 7;
		}

		this.browserWindow.setBounds({
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		});
	}

	applyFromLocalStorage() {
		var browserWindowStateFromLocalStorage = this.getFromLocalStorage();

		// If browserWindowState is available
		if(browserWindowStateFromLocalStorage) {
			this.load(browserWindowStateFromLocalStorage);
			this.apply();
		}
		else {
			this.applyDefault();
		}
	}

	getFromLocalStorage() {
		// Try local storage to see if browserWindowState is set
		var browserWindowStateFromLocalStorage = LocalStorage.get(this.identifier+'BrowserWindowState');
		//app.log('browserWindowStateFromLocalStorage', browserWindowStateFromLocalStorage);

		return browserWindowStateFromLocalStorage;
	}

	saveToLocalStorage() {
		//app.log('saveToLocalStorage', Json.encode(this.toObject()));
		LocalStorage.set(this.identifier+'BrowserWindowState', this.toObject());
	}

	saveToLocalStorageOnClose() {
		// Save window state to local storage
		document.htmlDocument.on('htmlDocument.unload.before', function(event) {
			this.load();
			this.saveToLocalStorage();
		}.bind(this));
	}

}

// Export
export default BrowserWindowState;

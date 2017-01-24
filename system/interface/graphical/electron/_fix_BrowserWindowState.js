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

	applyDefault() {
		var displays = Electron.screen.getAllDisplays();
		var defaultSettingsForDisplayCount = null;

		// Get the default settings for the display count
		if(displays.length == 1) {
			defaultSettingsForDisplayCount = this.settings.defaultWindowState.oneDisplay;
		}
		else if(displays.length > 1) {
			defaultSettingsForDisplayCount = this.settings.defaultWindowState.twoDisplays;
		}

		// Set the mode
		this.mode = defaultSettingsForDisplayCount.mode;

		// Set the display
		this.display = defaultSettingsForDisplayCount.display;
		var currentDisplay = displays[this.display - 1];
		//app.log(currentDisplay);

		// Set the width
		var width = defaultSettingsForDisplayCount.width;
		// If the width is a percentage
		if(width <= 1) {
			width = Number.round(width * currentDisplay.workArea.width);
		}
		this.width = width;
		//this.width = 1024;

		// Set the height
		var height = defaultSettingsForDisplayCount.height;
		// If the height is a percentage
		if(height <= 1) {
			height = Number.round(height * currentDisplay.workArea.height);
		}
		this.height = height;
		//this.height = 768;

		//app.log(width, height);

		// Set the x
		var x = defaultSettingsForDisplayCount.x;
		if(Number.is(x)) {
			// If x is a percentage
			if(x <= 1) {
				x = Number.round(x * currentDisplay.workArea.width);
			}
		}
		else if(String.is(x)) {
			if(x == 'left') {
				x = currentDisplay.bounds.x;
			}
			else if(x == 'center') {
				x = currentDisplay.bounds.x + Number.round((currentDisplay.workArea.width - this.width) / 2);
			}
			else if(x == 'right') {
				x = currentDisplay.bounds.x + Number.round((currentDisplay.workArea.width - this.width));
			}
		}
		this.x = x;
		//this.x = 100;

		// Set the y
		var y = defaultSettingsForDisplayCount.y;
		if(Number.is(y)) {
			// If y is a percentage
			if(y <= 1) {
				y = Number.round(y * currentDisplay.workArea.height);
			}
		}
		else if(String.is(y)) {
			if(y == 'top') {
				y = currentDisplay.bounds.y;
			}
			else if(y == 'center') {
				y = currentDisplay.bounds.y + Number.round((currentDisplay.workArea.height - this.height) / 2);
			}
			else if(y == 'bottom') {
				y = currentDisplay.bounds.y + Number.round((currentDisplay.workArea.height - this.height));

				// Adjust for OS X menu bar
				if(Node.Process.platform == 'darwin') {
					y += 24; // Menu bar is 22px tall but 24px seems to work better
				}
			}
		}
		this.y = y;
		//this.y = 100;

		this.apply();
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

	listenToScreenEvents() {
		// Display added
		if(this.settings.defaultWindowState.applyOn.displayAdded) {
			Electron.screen.on('display-added', function(event, newDisplay) {
				//app.log('display-added', event)
				this.applyDefault();
			}.bind(this));	
		}

		// Display removed
		if(this.settings.defaultWindowState.applyOn.displayRemoved) {
			Electron.screen.on('display-removed', function(event, oldDisplay) {
				//app.log('display-removed', event)
				this.applyDefault();
			}.bind(this));
		}

		// Display metrics changed
		if(this.settings.defaultWindowState.applyOn.displayMetricsChanged) {
			Electron.screen.on('display-metrics-changed', function(event, display, changedMetrics) {
				//app.log('display-metrics-changed', event)
				this.applyDefault();
			}.bind(this));
		}
	}

	toObject() {
		return {
			mode: this.mode,
			display: this.display,
			x: this.x,
			y: this.y,
			height: this.height,
			width: this.width,
		};
	}

}

// Export
export default BrowserWindowState;

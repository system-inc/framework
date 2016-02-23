// Class
var WindowState = Class.extend({

	identifier: null,
	browserWindow: null,
	settings: null,

	mode: null, // maximized, minimized, normal

	display: null, // The display to show on

	x: null,
	y: null,

	height: null,
	width: null,

	construct: function(identifier, browserWindow, settings) {
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
	},

	load: function(windowState) {
		if(!windowState) {
			windowState = this.get();
		}

		this.mode = windowState.mode;
		this.x = windowState.x;
		this.y = windowState.y;
		this.height = windowState.height;
		this.width = windowState.width;
	},

	get: function() {
		var windowState = {};

		// Mode
		if(this.browserWindow.isMaximized()) {
			windowState.mode = 'maximized';
		}
		else if(this.browserWindow.isMinimized()) {
			windowState.mode = 'minimized';
		}
		else {
			windowState.mode = 'normal';
		}
		
		// Catch full screen mode
		if(this.browserWindow.isFullScreen()) {
			windowState.mode = 'fullScreen';
		}		

		// Bounds
		var bounds = this.browserWindow.getBounds();
		windowState.width = bounds.width;
		windowState.height = bounds.height;
		windowState.x = bounds.x;
		windowState.y = bounds.y;

		return windowState;
	},

	apply: function() {
		//Console.log(this.mode);

		if(this.mode == 'maximized') {
			//Console.log('maximizing');
			this.browserWindow.maximize();
		}
		else if(this.mode == 'minimized') {
			//Console.log('minimizing');
			this.browserWindow.minimize();
		}
		else if(this.mode == 'fullScreen') {
			//Console.log('setting full screen');
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
	},

	applyDefault: function() {
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
		//Console.log(currentDisplay);

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

		//Console.log(width, height);

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
	},

	applyFromLocalStorage: function() {
		var windowStateFromLocalStorage = this.getFromLocalStorage();

		// If windowState is available
		if(windowStateFromLocalStorage) {
			this.load(windowStateFromLocalStorage);
			this.apply();
		}
		else {
			this.applyDefault();
		}
	},

	getFromLocalStorage: function() {
		// Try local storage to see if windowState is set
		var windowStateFromLocalStorage = LocalStorage.get(this.identifier+'WindowState');
		//Console.log('windowStateFromLocalStorage', windowStateFromLocalStorage);

		return windowStateFromLocalStorage;
	},

	saveToLocalStorage: function() {
		//Console.log('saveToLocalStorage', Json.encode(this.toObject()));
		LocalStorage.set(this.identifier+'WindowState', this.toObject());
	},

	saveToLocalStorageOnClose: function() {
		// Save window state to local storage
		window.addEventListener('beforeunload', function(event) {
			this.load();
			this.saveToLocalStorage();
		}.bind(this));
	},

	listenToScreenEvents: function() {
		// Display added
		if(this.settings.defaultWindowState.applyOn.displayAdded) {
			Electron.screen.on('display-added', function(event, newDisplay) {
				//Console.log('display-added', event)
				this.applyDefault();
			}.bind(this));	
		}

		// Display removed
		if(this.settings.defaultWindowState.applyOn.displayRemoved) {
			Electron.screen.on('display-removed', function(event, oldDisplay) {
				//Console.log('display-removed', event)
				this.applyDefault();
			}.bind(this));
		}

		// Display metrics changed
		if(this.settings.defaultWindowState.applyOn.displayMetricsChanged) {
			Electron.screen.on('display-metrics-changed', function(event, display, changedMetrics) {
				//Console.log('display-metrics-changed', event)
				this.applyDefault();
			}.bind(this));
		}
	},

	toObject: function() {
		return {
			mode: this.mode,
			display: this.display,
			x: this.x,
			y: this.y,
			height: this.height,
			width: this.width,
		};
	},

});

// Export
module.exports = WindowState;
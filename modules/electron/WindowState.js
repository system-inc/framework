WindowState = Class.extend({

	browserWindow: null,

	mode: null,
	x: null,
	y: null,
	height: null,
	width: null,

	construct: function(browserWindow) {
		this.browserWindow = browserWindow;

		// Initialize the current window state
		this.loadWindowState();

		// Save window state to local storage
		window.onbeforeunload = function(event) {
			this.loadWindowState();
			this.saveWindowStateToLocalStorage();
		}.bind(this);
	},

	loadWindowState: function(windowState) {
		if(!windowState) {
			windowState = this.getWindowStateFromBrowserWindow(this.browserWindow);
		}

		this.mode = windowState.mode;
		this.x = windowState.x;
		this.y = windowState.y;
		this.height = windowState.height;
		this.width = windowState.width;
	},

	getWindowStateFromBrowserWindow: function(browserWindow) {
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

	updateWindowWithWindowState: function() {
		if(this.mode == 'maximized' && !this.browserWindow.isMaximized()) {
			this.browserWindow.maximize();
		}
		else if(this.mode == 'minimized' && !this.browserWindow.isMinimized()) {
			this.browserWindow.minimize();
		}
		else if(this.mode == 'fullScreen' && !this.browserWindow.isFullScreen()) {
			this.browserWindow.setFullScreen(true);
		}

		this.browserWindow.setBounds({
			width: this.width,
			height: this.height,
			x: this.x,
			y: this.y,
		});
	},

	saveWindowStateToLocalStorage: function() {
		//console.log('saveWindowStateToLocalStorage', this.toObject());
		LocalStorage.set('windowState', this.toObject());
	},

	restoreWindowStateFromLocalStorage: function() {
		// Try local storage to see if windowState is set
		var windowStateFromLocalStorage = LocalStorage.get('windowState');
		//console.log('windowStateFromLocalStorage', windowStateFromLocalStorage);

		// If windowState is available
		if(windowStateFromLocalStorage) {
			this.loadWindowState(windowStateFromLocalStorage);
			this.updateWindowWithWindowState();
		}
	},

	toObject: function() {
		return {
			mode: this.mode,
			x: this.x,
			y: this.y,
			height: this.height,
			width: this.width,
		};
	},

});
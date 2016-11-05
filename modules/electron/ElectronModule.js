// Dependencies
import Module from 'system/module/Module.js';
import Version from 'system/version/Version.js';
import ElectronManager from 'system/electron/ElectronManager.js';

// Class
class ElectronModule extends Module {

	version = new Version('0.1.0');
	electronManager = null;

	defaultSettings = {
		mainBrowserWindow: {
			viewControllerName: 'MainViewController',
			windowState: {
				show: true, // Show the browser window
				remember: true, // Open the main browser window in same position when it was closed, can be either true or false
				defaultWindowState: {
					applyOn: {
						displayAdded: false,
						displayRemoved: false,
						displayMetricsChanged: false,
					},
					oneDisplay: {
						display: 1,
						mode: 'normal',
						width: .375, // Can be a number or percentage
						height: .6, // Can be a number or percentage
						x: 'center', // Can be a number, percentage, 'left', or 'right' 
						y: 'center', // Can be a number, percentage, 'top', or 'bottom'
					},
					twoDisplays: {
						display: 1,
						mode: 'normal',
						width: .375, // Can be a number or percentage
						height: .6, // Can be a number or percentage
						x: 'center', // Can be a number, percentage, 'left', 'center', or 'right' 
						y: 'center', // Can be a number, percentage, 'top', 'center', or 'bottom'
					},
				},
				defaultWindowStateKeyboardShortcut: true, // Boolean, if true, the shortcut Alt-Ctrl+W (Windows) or Option+Cmd+W (OS X) resets the window state the default position
			},
			developerTools: {
				show: false, // Show the developer tools on start
			},
		},
		shortcuts: {
			closeFocusedWindow: true,
			reloadFocusedWindow: true,
			toggleFullScreenOnFocusedWindow: true,
			toggleDeveloperToolsOnFocusedWindow: true,
			applyDefaultWindowStateOnFocusedWindow: true,
		},
	};

	async initialize() {
		await super.initialize(...arguments);

		this.electronManager = new ElectronManager();
		this.electronManager.initialize();
	},
	
}

// Export
export default ElectronModule;

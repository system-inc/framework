require('./Electron');
require('./WindowState');

ElectronModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);

		this.settings.default({
			mainBrowserWindow: {
				windowState: {
					remember: true, // Open the main browser window in same position when it was closed, can be either true or false
					defaultWindowState: {
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
					show: true, // Show the developer tools on start
					//TODO: enableKeyboardShortcut: true, // Enable the default Chrome keyboard shortcut to open the developer tools
				},
			},
		});
	},
	
});

// Initialize the module
ElectronModule = new ElectronModuleClass();
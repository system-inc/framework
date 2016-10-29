//TODO: 7.0.0 means when Node 7.0.0 comes out in Electron
// 7.0.0: This can all move to FrameworkApp.initializeGraphicalInterfaceInElectron or probably ElectronManager or something

// Dependencies
var Electron = require('electron');

// 7.0.0: This will be app.directory, won't even need this variable
var appScriptFilePath = require('path').join(__dirname, 'index.js');

// Class
class FrameworkElectronApp {

	constructor() {
		this.mainWindow = null;

		Electron.app.commandLine.appendSwitch('--js-flags', '--harmony');

		Electron.app.on('ready', this.createMainWindow.bind(this));

		Electron.app.on('activate', function () {
			if(mainWindow === null) {
				this.createMainWindow();
			}
		}.bind(this));

		// Quit when all windows are closed if not on macOS
		Electron.app.on('window-all-closed', function () {
			if(process.platform !== 'darwin') {
				Electron.app.quit()
			}
		});
	}

	createMainWindow() {
		console.log('FrameworkElectronApp createMainWindow');

		// 7.0.0: This should all be configured using app settings
		this.mainWindow = new Electron.BrowserWindow({
			width: 800,
			height: 600,
			webPreferences: {
				preload: appScriptFilePath,
			},
		});
		this.mainWindow.loadURL('about:blank');
		this.mainWindow.webContents.openDevTools()
		this.mainWindow.on('closed', function () {
			this.mainWindow = null
		}.bind(this));
	}

}

// Global instance
global.frameworkElectronApp = new FrameworkElectronApp();

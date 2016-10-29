var Electron = require('electron');
var mainWindow = null;

function createMainWindow() {
	mainWindow = new Electron.BrowserWindow({width: 800, height: 600});
	mainWindow.loadURL('about:blank');
	mainWindow.webContents.openDevTools()
	mainWindow.on('closed', function () {
		mainWindow = null
	});
}

Electron.app.on('ready', createMainWindow);

// Quit when all windows are closed.
Electron.app.on('window-all-closed', function () {
	if(process.platform !== 'darwin') {
		app.quit()
	}
});

Electron.app.on('activate', function () {
	if(mainWindow === null) {
		createMainWindow()
	}
});

Electron.app.on('window-all-closed', Electron.app.quit);

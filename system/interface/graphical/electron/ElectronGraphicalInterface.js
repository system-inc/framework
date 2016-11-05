// Dependencies
import GraphicalInterface from './../GraphicalInterface.js';
import Electron from 'electron';

// Class
class ElectronGraphicalInterface extends GraphicalInterface {

	electronBrowserWindow = null;

	backgroundColor = null;
	useContentDimensions = null;

	resizable = null;
	movable = null;
	minimizable = null;
	maximizable = null;
	fullscreenable = null;
	closable = null;
	focusable = null;
	alwaysOnTop = null;

	constructor(identifier) {
		super(identifier);

		console.log('Electron', Electron);

		this.electronBrowserWindow = new Electron.BrowserWindow({
			show: false,
		});
	}

	show() {
		this.electronBrowserWindow.show();
	}

}

// Export
export default ElectronGraphicalInterface;

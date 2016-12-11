// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class ElectronMenu extends EventEmitter {

	electronMenu = null;

	constructor() {
		this.create();
	}

	create() {
		throw new Error('Subclasses must implement Menu.createMenu().');
	}

	update() {
		// TODO: https://github.com/atom/electron/issues/528
		// Update just calls this.create() as Electron needs to recreate the entire menu to update menu labels
		this.create.apply(this, arguments);
	}

	show() {
		this.electronMenu.popup();
	}

	getDefault() {
		var menu = null;
		var defaultMenu = ElectronMenu.getDefaultTemplate();

		if(defaultMenu) {
			menu = Electron.remote.Menu.buildFromTemplate(this.getDefaultMenuTemplate());	
		}

		return menu;
	}

	static getDefaultMenuTemplate() {
		var template = null;

		// If on macOS
		if(app.onMacOs()) {
			template = [
				{
					label: app.title,
					submenu: [
						{
							label: 'About '+app.title,
							selector: 'orderFrontStandardAboutPanel:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Services',
							submenu: []
						},
						{
							type: 'separator'
						},
						{
							label: 'Hide '+app.title,
							accelerator: 'Command+H',
							selector: 'hide:'
						},
						{
							label: 'Hide Others',
							accelerator: 'Command+Shift+H',
							selector: 'hideOtherApplications:'
						},
						{
							label: 'Show All',
							selector: 'unhideAllApplications:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Quit',
							accelerator: 'Command+Q',
							click: this.exit.bind(this),
						},
					]
				},
				{
					label: 'Edit',
					submenu: [
						{
							label: 'Undo',
							accelerator: 'Command+Z',
							selector: 'undo:'
						},
						{
							label: 'Redo',
							accelerator: 'Shift+Command+Z',
							selector: 'redo:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Cut',
							accelerator: 'Command+X',
							selector: 'cut:'
						},
						{
							label: 'Copy',
							accelerator: 'Command+C',
							selector: 'copy:'
						},
						{
							label: 'Paste',
							accelerator: 'Command+V',
							selector: 'paste:'
						},
						{
							label: 'Select All',
							accelerator: 'Command+A',
							selector: 'selectAll:'
						},
					]
				},
				{
					label: 'Window',
					submenu: [
						{
							label: 'Minimize',
							accelerator: 'Command+M',
							selector: 'performMiniaturize:'
						},
						{
							label: 'Close',
							accelerator: 'Command+W',
							selector: 'performClose:'
						},
						{
							type: 'separator'
						},
						{
							label: 'Bring All to Front',
							selector: 'arrangeInFront:'
						},
					]
				},
			];
		}

		return template;
	}

}

// Export
export default Menu;

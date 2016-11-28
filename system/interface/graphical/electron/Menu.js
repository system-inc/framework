// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';

// Class
class Menu extends EventEmitter {

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

}

// Export
export default Menu;

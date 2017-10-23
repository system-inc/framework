// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';

// Class
class ElectronMenu extends PropagatingEventEmitter {

	menu = null;

	constructor() {
		super();

		this.create();
	}

	create() {
		this.menu = new app.modules.electronModule.electron.remote.Menu();

        return this.menu;
	}

	update() {
		// TODO: https://github.com/atom/electron/issues/528
		// Update just calls this.create() as Electron needs to recreate the entire menu to update menu labels
		this.create(...arguments);
	}

	show() {
		this.menu.popup();
	}

    /*
        Default macOS Menubar Menu

            App
                About App
            Edit
                Undo
                Redo
                -
                Cut
                Copy
                Paste
                Paste and Match Style
                Delete
                Select All
                -
                Speech
                -
                Start Dictation
                Emoji & Symbols
            View
                Reload
                Force Reload
                Toggle Developer Tools
                -
                Actual Size
                Zoom In
                Zoom Out
                -
                Enter Full Screen
            Window
                Close Window
                Minimize
                Zoom
                -
                Bring All to Front
                -
                App
            Help
                Search
                Learn More
                Documentation
                Community Discussions
                Search Issues
        */

}

// Export
export default ElectronMenu;

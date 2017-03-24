// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';

// Class
class ElectronMenu extends PropagatingEventEmitter {

	electronMenu = null;

	constructor() {
		super();

		this.create();
	}

	create() {
		throw new Error('Subclasses must implement Menu.create().');
	}

	update() {
		// TODO: https://github.com/atom/electron/issues/528
		// Update just calls this.create() as Electron needs to recreate the entire menu to update menu labels
		this.create.apply(this, arguments);
	}

	show() {
		this.electronMenu.popup();
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

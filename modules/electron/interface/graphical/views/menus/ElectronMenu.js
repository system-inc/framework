// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';

// Class
class ElectronMenu extends PropagatingEventEmitter {

	menu = null;

	constructor() {
		super();

        this.menu = new app.modules.electronModule.electron.remote.Menu();

		//this.create();
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

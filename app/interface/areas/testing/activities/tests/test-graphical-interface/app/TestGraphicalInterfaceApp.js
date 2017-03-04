// Globals
import 'framework/globals/Globals.js';

// Dependencies
import App from 'framework/system/app/App.js';

// Class
class TestGraphicalInterfaceApp extends App {

	async initialize() {
		await super.initialize(...arguments);

		// Tell the parent we are ready
		this.interfaces.graphical.emit('testGraphicalInterfaceApp.ready');
	}

}

// Global instance
global.app = new TestGraphicalInterfaceApp(__dirname);

// Initialize
global.app.initialize();

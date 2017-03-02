// Globals
import 'framework/globals/Globals.js';

// Dependencies
import App from 'framework/system/app/App.js';

// Class
class TestGraphicalInterfaceApp extends App {

	parentGraphicalInterfaceProxy = null;

	async initialize() {
		await super.initialize(...arguments);

		// Set the parent
		this.parentGraphicalInterface = this.interfaces.graphical.manager.getParent();

		// Tell the parent we are ready
		this.parentGraphicalInterfaceProxy.sendMessage('status', 'ready');
	}

}

// Global instance
global.app = new TestGraphicalInterfaceApp(__dirname);

// Initialize
global.app.initialize();

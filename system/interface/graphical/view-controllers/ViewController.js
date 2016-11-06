// Dependencies
import Settings from 'system/settings/Settings.js';

// Class
class ViewController {

	settings = new Settings();

	graphicalInterface = null;
	view = null;
	subviews = {};

	constructor(settings) {
		this.settings.merge(settings);

		this.graphicalInterface = app.interfaces.graphicalInterfaceManager.getCurrentGraphicalInterface();
		this.createView();
		this.createSubviews();
	}

	createView() {
	}

	createSubviews() {
	}

	initialize() {
		this.graphicalInterface.on('graphicalInterface.initialized', function() {
			this.initialize();
		}.bind(this));

		this.graphicalInterface.initialize();
	}

}

// Export
export default ViewController;

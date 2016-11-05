// Dependencies
import Settings from 'system/settings/Settings.js';
//import ViewContainer from 'system/interface/graphical/web/view-containers/ViewContainer.js';

// Class
class ViewController {

	viewContainer = null;
	view = null;
	subviews = {};

	settings = new Settings();

	constructor(settings) {
		this.settings.merge(settings);

		this.createViewContainer();

		this.createView();

		this.createSubviews();

		this.initializeViewContainer();
	}

	createViewContainer() {
		//this.viewContainer = new ViewContainer();
	}

	createView() {
		this.view = this.viewContainer.body;
	}

	createSubviews() {
	}

	initializeViewContainer() {
		this.viewContainer.on('viewContainer.initialized', function() {
			this.initialize();
		}.bind(this));

		this.viewContainer.initialize();
	}

	initialize() {
	}

}

// Export
export default ViewController;

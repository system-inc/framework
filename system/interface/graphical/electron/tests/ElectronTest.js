// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// Class
class ElectronTest extends Test {

	graphicalInterface = null;
	viewController = null;

	constructor() {
		super();

		this.viewController = new ViewController();
	}

	render(view) {
		if(view !== undefined) {
			this.viewController.view = view;
		}

		// Have the graphical interface manager create a graphical interface with a view controller
        this.graphicalInterface = app.interfaces.graphicalInterfaceManager.create(this.viewController);
	}

	async shouldRun() {
		return app.inElectronContext();
	}

	async before() {
		var ElectronGraphicalInterfaceManager = require('framework/system/interface/graphical/managers/electron/ElectronGraphicalInterfaceManager.js').default;

		app.interfaces.graphicalInterfaceManager = new ElectronGraphicalInterfaceManager();
	}

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronTest;

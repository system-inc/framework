// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import ElectronGraphicalInterfaceManager from 'framework/system/interface/graphical/managers/electron/ElectronGraphicalInterfaceManager.js';

// Create a graphical interface manager, in this case, ElectronGraphicalInterfaceManager
//app.interfaces.graphicalInterfaceManager = new ElectronGraphicalInterfaceManager();

//var FrameworkViewController = require('interface/FrameworkViewController.js').default;

//// Have the graphical interface manager create a graphical interface with a view controller
//app.interfaces.graphicalInterfaceManager.create(new FrameworkViewController());

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
		app.interfaces.graphicalInterfaceManager = new ElectronGraphicalInterfaceManager();
	}

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronTest;

// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';

import ElectronGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/electron/ElectronGraphicalInterfaceAdapter.js';

import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ElectronGraphicalInterfaceTest extends ElectronTest {

	viewController = null;

	constructor() {
		super();

		this.viewController = new ViewController();
	}

	async render(viewOrViewController) {
		if(viewOrViewController !== undefined) {
			if(View.is(viewOrViewController)) {
				this.viewController.view = viewOrViewController;
			}
			else if(ViewController.is(viewOrViewController)) {
				this.viewController = viewOrViewController;
			}
		}

		// Have the graphical interface manager create a graphical interface with a view controller
		await app.interfaces.graphical.initialize(this.viewController);
	}

	inputPressView = ElectronGraphicalInterfaceAdapter.prototype.inputPressView;
	inputPressDoubleView = ElectronGraphicalInterfaceAdapter.prototype.inputPressDoubleView;
	inputHoverView = ElectronGraphicalInterfaceAdapter.prototype.inputHoverView;
	inputScrollView = ElectronGraphicalInterfaceAdapter.prototype.inputScrollView;

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronGraphicalInterfaceTest;

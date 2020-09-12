// Dependencies
import { ElectronTest } from '@framework/modules/electron/tests/ElectronTest.js';

import { ElectronGraphicalInterfaceAdapter } from '@framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js';

import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class GraphicalInterfaceElectronTest extends ElectronTest {

	// This is an abstract class, do not add any tests here

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

}

// Export
export { GraphicalInterfaceElectronTest };

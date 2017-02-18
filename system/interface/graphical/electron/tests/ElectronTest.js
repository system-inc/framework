// Dependencies
import Test from 'framework/system/test/Test.js';

import ElectronGraphicalInterfaceAdapter from 'framework/system/interface/graphical/adapters/electron/ElectronGraphicalInterfaceAdapter.js';

// Class
class ElectronTest extends Test {

	async shouldRun() {
		return app.inElectronContext();
	}

	inputKeyDown = ElectronGraphicalInterfaceAdapter.prototype.inputKeyDown;
	inputKeyUp = ElectronGraphicalInterfaceAdapter.prototype.inputKeyUp;
	inputKeyPress = ElectronGraphicalInterfaceAdapter.prototype.inputKeyPress;
	inputKeyPressByCombination = ElectronGraphicalInterfaceAdapter.prototype.inputKeyPressByCombination;

	inputHover = ElectronGraphicalInterfaceAdapter.prototype.inputHover;

	inputScroll = ElectronGraphicalInterfaceAdapter.prototype.inputScroll;

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronTest;

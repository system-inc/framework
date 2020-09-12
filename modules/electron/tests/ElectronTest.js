// Dependencies
import { Test } from '@framework/system/test/Test.js';
import { ElectronGraphicalInterfaceAdapter } from '@framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js';

// Class
class ElectronTest extends Test {

	async shouldRun() {
		return app.inGraphicalInterfaceEnvironment();
	}

	// Input - Key
	inputKeyDown = ElectronGraphicalInterfaceAdapter.prototype.inputKeyDown;
	inputKeyUp = ElectronGraphicalInterfaceAdapter.prototype.inputKeyUp;
	inputKeyPress = ElectronGraphicalInterfaceAdapter.prototype.inputKeyPress;
	inputKeyPressByCombination = ElectronGraphicalInterfaceAdapter.prototype.inputKeyPressByCombination;

	// Input - Hover
	inputHover = ElectronGraphicalInterfaceAdapter.prototype.inputHover;

	// Input - Scroll
	inputScroll = ElectronGraphicalInterfaceAdapter.prototype.inputScroll;

	// This is an abstract class, do not add any tests here

}

// Export
export { ElectronTest };

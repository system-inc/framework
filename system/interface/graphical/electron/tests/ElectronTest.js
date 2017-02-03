// Dependencies
import Test from 'framework/system/test/Test.js';
import Assert from 'framework/system/test/Assert.js';

// Create a graphical interface manager, in this case, ElectronGraphicalInterfaceManager
//app.interfaces.graphicalInterfaceManager = new ElectronGraphicalInterfaceManager();

//var FrameworkViewController = require('interface/FrameworkViewController.js').default;

//// Have the graphical interface manager create a graphical interface with a view controller
//app.interfaces.graphicalInterfaceManager.create(new FrameworkViewController());

// Class
class ElectronTest extends Test {

	async shouldRun() {
		return app.inElectronContext();
	}

	// This is an abstract class, do not add any tests here

}

// Export
export default ElectronTest;

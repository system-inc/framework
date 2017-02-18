// Dependencies
import ElectronGraphicalInterfaceTest from 'framework/system/interface/graphical/electron/tests/ElectronGraphicalInterfaceTest.js';
import Assert from 'framework/system/test/Assert.js';

import View from 'framework/system/interface/graphical/views/View.js';
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';

// Class
class ViewTest extends ElectronGraphicalInterfaceTest {

	async testView() {
		// Create a new view
		var actual = new View();

		Assert.true(Class.doesImplement(View, PropagatingEventEmitter), 'View class implements PropagatingEventEmitter');
	}
	
}

// Export
export default ViewTest;

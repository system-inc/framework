// Dependencies
import { GraphicalInterfaceElectronTest } from '@framework/modules/electron/interface/graphical/tests/GraphicalInterfaceElectronTest.js';
import { Assert } from '@framework/system/test/Assert.js';

import { View } from '@framework/system/interface/graphical/views/View.js';
import { PropagatingEventEmitter } from '@framework/system/event/PropagatingEventEmitter.js';

// Class
class ViewTest extends GraphicalInterfaceElectronTest {

	async testView() {
		// Create a new view
		var actual = new View();

		Assert.true(Class.doesImplement(View, PropagatingEventEmitter), 'View class implements PropagatingEventEmitter');
	}

	async testViewEmpty() {
		// Create a new view
		var view = new View();

		// Render the view
        await this.render(view);

		// Create a couple of child views
		var childView1 = new View();
		var childView2 = new View();

		// Append them
		view.append(childView1);
		view.append(childView2);

		Assert.strictEqual(view.children.length, 2, 'view.append() works');

		view.empty();

		Assert.strictEqual(view.children.length, 0, 'view.empty() works');
	}
	
}

// Export
export { ViewTest };

// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { View } from '@framework/system/interface/graphical/views/View.js';
import { AreaNavigationView } from '@app/interface/area/navigation/AreaNavigationView.js';

// Class
class AreaNavigationViewController extends ViewController {

	constructor() {
		super();

		this.view = new AreaNavigationView();
	}

}

// Export
export { AreaNavigationViewController };

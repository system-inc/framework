// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { View } from '@framework/system/interface/graphical/views/View.js';
import ActivityNavigationView from '@app/interface/area/activity/navigation/ActivityNavigationView.js';

// Class
class ActivityNavigationViewController extends ViewController {

	constructor() {
		super();

		this.view = new ActivityNavigationView();
	}

}

// Export
export { ActivityNavigationViewController };

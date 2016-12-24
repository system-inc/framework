// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import ActivityContentView from 'interface/area/activity/content/ActivityContentView.js';

// Class
class ActivityContentViewController extends ViewController {

	constructor() {
		super();

		this.view = new ActivityContentView();
	}

}

// Export
export default ActivityContentViewController;

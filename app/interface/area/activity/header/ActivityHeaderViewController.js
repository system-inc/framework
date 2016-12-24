// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import ActivityHeaderView from 'interface/area/activity/header/ActivityHeaderView.js';

// Class
class ActivityHeaderViewController extends ViewController {

	constructor() {
		super();

		this.view = new ActivityHeaderView();
	}

}

// Export
export default ActivityHeaderViewController;

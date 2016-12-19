// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import ActivityView from 'interface/area/activity/ActivityView.js';

// Class
class ActivityViewController extends ViewController {

	constructor() {
		super();

		this.view = new ActivityView();
	}

}

// Export
export default NavigationViewController;

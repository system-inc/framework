// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { View } from '@framework/system/interface/graphical/views/View.js';
import ActivityConsoleView from '@app/interface/area/activity/console/ActivityConsoleView.js';

// Class
class ActivityConsoleViewController extends ViewController {

	constructor() {
		super();

		this.view = new ActivityConsoleView();
	}

}

// Export
export { ActivityConsoleViewController };

// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import BodyNavigationView from 'interface/layout/body/navigation/BodyNavigationView.js';

// Class
class BodyNavigationViewController extends ViewController {

	constructor() {
		super();

		this.view = new BodyNavigationView();
	}

}

// Export
export default BodyNavigationViewController;

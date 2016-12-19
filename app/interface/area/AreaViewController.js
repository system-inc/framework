// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import AreaView from 'interface/area/AreaView.js';

// Class
class AreaViewController extends ViewController {

	constructor() {
		super();

		this.view = new AreaView();
	}

}

// Export
export default AreaViewController;

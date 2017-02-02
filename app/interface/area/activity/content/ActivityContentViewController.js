// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ActivityContentViewController extends ViewController {

	constructor() {
		super();

		this.view = new View();

		this.view.setStyle({
			flex: '1',
			overflow: 'scroll',
			padding: '1rem',
            fontSize: '.8em',
		});
	}

}

// Export
export default ActivityContentViewController;

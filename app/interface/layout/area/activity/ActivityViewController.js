// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import NavigationView from 'interface/navigation/NavigationView.js';

// Class
class NavigationViewController extends ViewController {

	constructor() {
		super();

		this.view = new NavigationView();
	}

}

// Export
export default NavigationViewController;

// Dependencies
import ViewController from 'system/interface/graphical/view-controllers/ViewController.js';
import View from 'system/interface/graphical/views/View.js';

// Class
class FrameworkViewController extends ViewController {

	createView() {
		this.view = new View('hi');
	}

}

// Export
export default FrameworkViewController;
// Dependencies
import ViewController from 'system/interface/graphical/view-controllers/ViewController.js';
import View from 'system/interface/graphical/views/View.js';
import HeaderView from 'interface/header/HeaderView.js';

// Class
class HeaderViewController extends ViewController {

	createView() {
		return new HeaderView();
	}

}

// Export
export default HeaderViewController;

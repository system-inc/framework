// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import HeaderView from 'interface/header/HeaderView.js';

// Class
class HeaderViewController extends ViewController {

	constructor() {
		super();

		this.view = new HeaderView();
	}

}

// Export
export default HeaderViewController;

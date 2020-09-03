// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { HeaderView } from '@app/interface/layout/header/HeaderView.js';

// Class
class HeaderViewController extends ViewController {

	constructor() {
		super();

		this.view = new HeaderView();
	}

}

// Export
export { HeaderViewController };

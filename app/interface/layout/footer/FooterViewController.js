// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { FooterView } from '@app/interface/layout/footer/FooterView.js';

// Class
class FooterViewController extends ViewController {

	constructor() {
		super();

		this.view = new FooterView();
	}

}

// Export
export { FooterViewController };

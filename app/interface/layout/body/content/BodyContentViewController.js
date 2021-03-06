// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import { BodyContentView } from '@app/interface/layout/body/content/BodyContentView.js';

// Class
class BodyContentViewController extends ViewController {

	constructor() {
		super();

		this.view = new BodyContentView();
	}

}

// Export
export { BodyContentViewController };

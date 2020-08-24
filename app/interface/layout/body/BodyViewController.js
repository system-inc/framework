// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import BodyView from '@app/interface/layout/body/BodyView.js';

// Class
class BodyViewController extends ViewController {

	constructor() {
		super();

		this.view = new BodyView();
	}

}

// Export
export { BodyViewController };

// Dependencies
import { ViewController } from '@framework/system/interface/graphical/view-controllers/ViewController.js';
import ConsoleView from '@app/interface/console/ConsoleView.js';

// Class
class ConsoleViewController extends ViewController {

	constructor() {
		super();

		this.view = new ConsoleView();
	}

}

// Export
export { ConsoleViewController };

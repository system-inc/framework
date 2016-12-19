// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import ConsoleView from 'interface/console/ConsoleView.js';

// Class
class ConsoleViewController extends ViewController {

	constructor() {
		super();

		this.view = new ConsoleView();
	}

}

// Export
export default ConsoleViewController;

// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import HeaderViewController from 'interface/layout/header/HeaderViewController.js';
import AreaViewController from 'interface/layout/area/AreaViewController.js';


// Class
class FrameworkViewController extends ViewController {

	headerViewController = null;
	navigationViewController = null;

	constructor() {
		super();

		// Create and configure the view
		this.view = new View();
		this.view.addClass('framework');

		// Add the HeaderViewController
		this.headerViewController = this.append(new HeaderViewController());

		// Add the AreaViewController
		this.navigationViewController = this.append(new AreaViewController());
	}

	initialize() {
		super.initialize(...arguments);

		console.error('this is not working as expected - it doesnt appear to be pulling it into the DOM');
		this.graphicalInterface.adapter.addStyleSheet('interface/style-sheets/framework.css');
	}

}

// Export
export default FrameworkViewController;

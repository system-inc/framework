// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import HeaderViewController from 'interface/header/HeaderViewController.js';
import NavigationViewController from 'interface/navigation/NavigationViewController.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class FrameworkViewController extends ViewController {

	headerViewController = null;
	navigationViewController = null;

	constructor() {
		super();

		// Create and configure the view
		this.view = new View();
		this.view.addClass('framework');

		// Header
		this.headerViewController = this.append(new HeaderViewController());

		// Navigation
		this.navigationViewController = this.append(new NavigationViewController());
	}

	initialize() {
		super.initialize(...arguments);

		console.error('this is not working as expected - it doesnt appear to be pulling it into the DOM');
		this.graphicalInterface.adapter.addStyleSheet('interface/style-sheets/framework.css');
	}

}

// Export
export default FrameworkViewController;

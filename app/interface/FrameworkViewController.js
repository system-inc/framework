// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import HeaderViewController from 'interface/header/HeaderViewController.js';
import NavigationViewController from 'interface/navigation/NavigationViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class FrameworkViewController extends ViewController {

	headerViewController = null;
	navigationViewController = null;

	constructor() {
		super();

		// Configure the GraphicalInterface
		// TODO: figure out an abstract way to do this: this.graphicalInterface.styles.add('framework.css');

		this.view = new View();
		this.view.addClass('framework');

		// Header
		this.headerViewController = this.append(new HeaderViewController());
		this.view.append(this.headerViewController.view);

		// Navigation
		this.navigationViewController = this.append(new NavigationViewController());
		this.view.append(this.navigationViewController.view);
	}

}

// Export
export default FrameworkViewController;

// Dependencies
import ViewController from 'system/interface/graphical/view-controllers/ViewController.js';
import HeaderViewController from 'interface/header/HeaderViewController.js';
import NavigationViewController from 'interface/navigation/NavigationViewController.js';
import View from 'system/interface/graphical/views/View.js';
import HeadingView from 'system/interface/graphical/views/text/HeadingView.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';

// Class
class FrameworkViewController extends ViewController {

	headerViewController = null;
	navigationViewController = null;

	createView() {
		var view = new View();

		// Header
		this.headerViewController = this.append(new HeaderViewController());
		view.append(this.headerViewController.view);

		// Navigation
		this.navigationViewController = this.append(new NavigationViewController());
		view.append(this.navigationViewController.view);

		return view;
	}

}

// Export
export default FrameworkViewController;

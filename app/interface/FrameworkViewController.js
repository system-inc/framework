// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

// Header
import HeaderViewController from 'interface/layout/header/HeaderViewController.js';

// Body
import BodyViewController from 'interface/layout/body/BodyViewController.js';

// Body - Navigation
import BodyNavigationViewController from 'interface/layout/body/navigation/BodyNavigationViewController.js';
import AreaNavigationViewController from 'interface/area/navigation/AreaNavigationViewController.js';
import ActivityNavigationViewController from 'interface/area/activity/navigation/ActivityNavigationViewController.js';

// Body - Content
import BodyContentViewController from 'interface/layout/body/content/BodyContentViewController.js';
import AreaViewController from 'interface/area/AreaViewController.js';

// Footer
import FooterViewController from 'interface/layout/footer/FooterViewController.js';
import ConsoleViewController from 'interface/console/ConsoleViewController.js';

// Class
class FrameworkViewController extends ViewController {

	// Header
	headerViewController = null;

	// Body
	bodyViewController = null;
	
	// Body - Navigation
	bodyNavigationViewController = null;
	areaNavigationViewController = null;
	activityNavigationViewController = null;

	// Body - Content
	bodyContentViewController = null;
	areaViewController = null;

	// Footer
	footerViewController = null;
	consoleViewController = null;

	constructor() {
		super();

		// Create and configure the view
		this.view = new View();
		this.view.addClass('framework');

		// Header
		this.headerViewController = this.append(new HeaderViewController());

		// Body
		this.bodyViewController = this.append(new BodyViewController());

		// Body - Navigation
		this.bodyNavigationViewController = this.bodyViewController(new BodyNavigationViewController());
		this.areaNavigationViewController = this.bodyNavigationViewController.append(new AreaNavigationViewController());
		this.activityNavigationViewController = this.bodyNavigationViewController.append(new activityNavigationViewController());

		// Body - Content
		this.bodyContentViewController = this.bodyViewController.append(new BodyContentViewController());
		this.areaViewController = this.bodyContentViewController.append(new AreaViewController);

		// Footer
		this.footerViewController = this.append(new FooterViewController());
		this.consoleViewController = this.footerViewController.append(new ConsoleViewController);
	}

	initialize() {
		super.initialize(...arguments);

		console.error('this is not working as expected - it doesnt appear to be pulling it into the DOM');
		this.graphicalInterface.adapter.addStyleSheet('interface/style-sheets/framework.css');
	}

}

// Export
export default FrameworkViewController;

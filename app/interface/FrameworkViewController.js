// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

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
import ActivityHeaderViewController from 'interface/area/activity/header/ActivityHeaderViewController.js';
import ActivityContentViewController from 'interface/area/activity/content/ActivityContentViewController.js';
import ActivityConsoleViewController from 'interface/area/activity/console/ActivityConsoleViewController.js';

// Footer
import FooterViewController from 'interface/layout/footer/FooterViewController.js';
import ConsoleViewController from 'interface/console/ConsoleViewController.js';

// Activities
import TestsActivityContentViewController from 'interface/areas/testing/activities/tests/TestsActivityContentViewController.js';

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
	activityHeaderViewController = null;
	activityContentViewController = null;
	activityConsoleViewController = null;

	// Footer
	footerViewController = null;
	consoleViewController = null;

	constructor() {
		//console.log('FrameworkViewController.constructor');

		super();

		// Create and configure the view
		this.view = new View();
		this.view.setStyle({
			display: 'flex',
			height: '100%',
			flexDirection: 'column',
		});

		// Header
		this.headerViewController = this.append(new HeaderViewController());

		// Body
		this.bodyViewController = this.append(new BodyViewController());

		// Body - Navigation
		this.bodyNavigationViewController = this.bodyViewController.append(new BodyNavigationViewController());
		this.areaNavigationViewController = this.bodyNavigationViewController.append(new AreaNavigationViewController());
		this.activityNavigationViewController = this.bodyNavigationViewController.append(new ActivityNavigationViewController());

		// Body - Content
		this.bodyContentViewController = this.bodyViewController.append(new BodyContentViewController());
		this.activityHeaderViewController = this.bodyContentViewController.append(new ActivityHeaderViewController());
		this.activityContentViewController = this.bodyContentViewController.append(new ActivityContentViewController());
		//this.activityConsoleViewController = this.bodyViewController.append(new ActivityConsoleViewController());

		// Activities
		this.activityContentViewController.append(new TestsActivityContentViewController());

		// Footer
		//this.footerViewController = this.append(new FooterViewController());
		//this.consoleViewController = this.footerViewController.append(new ConsoleViewController());
	}

	initialize() {
		super.initialize(...arguments);

		// Must set <html> height to 100%
		app.interfaces.graphical.adapter.htmlDocument.view.setStyle({
			height: '100%',
		});
		
		// Must set <body> height to 100%
		app.interfaces.graphical.adapter.htmlDocument.body.setStyle({
			height: '100%',
		});

		// Add style sheets to the html document
		//app.interfaces.graphical.adapter.addStyleSheet('interface/style-sheets/framework.css');
		app.interfaces.graphical.adapter.addStyleSheet('file://'+Node.Path.join(app.framework.directory, 'system', 'interface', 'graphical', 'web', 'themes', 'reset', 'style-sheets', 'reset.css'));
		app.interfaces.graphical.adapter.addStyleSheet('file://'+Node.Path.join(app.framework.directory, 'system', 'interface', 'graphical', 'web', 'themes', 'framework', 'style-sheets', 'framework.css'));
	}

}

// Export
export default FrameworkViewController;

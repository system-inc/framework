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
	activityHeaderViewController = null;
	activityContentViewController = null;

	// Footer
	footerViewController = null;
	consoleViewController = null;

	constructor() {
		super();

		// Create and configure the view
		this.view = new View();
		this.view.setStyle({
			display: 'flex',
			height: '100%',
			flexDirection: 'column',
		});
		this.view.addClass('framework');

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

		// Footer
		this.footerViewController = this.append(new FooterViewController());
		this.consoleViewController = this.footerViewController.append(new ConsoleViewController());
	}

	initialize() {
		super.initialize(...arguments);

		this.graphicalInterface.adapter.htmlDocument.view.setStyle({
			height: '100%',
		});
		
		this.graphicalInterface.adapter.htmlDocument.body.setStyle({
			height: '100%',
		});

		//this.graphicalInterface.adapter.addStyleSheet('interface/style-sheets/framework.css');
		this.graphicalInterface.adapter.addStyleSheet(Node.Path.join(app.framework.directory, 'system', 'interface', 'graphical', 'web', 'themes', 'reset', 'style-sheets', 'reset.css'));
		this.graphicalInterface.adapter.addStyleSheet(Node.Path.join(app.directory, 'interface', 'style-sheets', 'framework.css'));
	}

}

// Export
export default FrameworkViewController;

// Dependencies
import ViewController from 'system/interface/graphical/view-controllers/ViewController.js';
import View from 'system/interface/graphical/views/View.js';
import HeadingView from 'system/interface/graphical/views/text/HeadingView.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';

// Class
class FrameworkViewController extends ViewController {

	createView() {
		var view = new View();

		view.append(new HeadingView(app.title+' '+app.version, 3));
		view.append(new TextView(app.description));

		return view;
	}

}

// Export
export default FrameworkViewController;

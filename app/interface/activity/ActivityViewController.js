// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ActivityViewController extends ViewController {

	createView() {
		var view = new View();

		view.append(new HeadingView('Activity', 2));

		return view;
	}

}

// Export
export default ActivityViewController;

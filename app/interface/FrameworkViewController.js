// Dependencies
import ViewController from 'system/interface/graphical/view-controllers/ViewController.js';
import View from 'system/interface/graphical/views/View.js';

// Class
class FrameworkViewController extends ViewController {

	createView() {
		console.log('making view');
		this.view = new View('hello!');

		var button = new View('button');

		this.view.append(button);
	}

}

// Export
export default FrameworkViewController;

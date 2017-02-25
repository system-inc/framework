// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';

// Class
class ViewController extends PropagatingEventEmitter {

	view = null;
	children = [];

	constructor() {
		// PropagatingEventEmitter
		super();

		// Don't do this as this is wasted work if the subclass of ViewController uses a custom view
		//this.view = new View();
	}

	async initialize() {
		if(this.view) {
			await this.view.initialize();
		}
		else {
			app.warn('View does not exist for ViewController.');
		}
	}

	descendFromParent(parentViewController) {
		this.parent = parentViewController;
		this.graphicalInterface = this.parent.graphicalInterface;

		return this;
	}

	append(viewController, viewToAppendTo = null) {
		// Set the view controller's parent
		viewController.descendFromParent(this);

		// Add the view controller as a child
		this.children.append(viewController);

		// Append the view controller's view into the view heirarchy
		if(this.view === null) {
			throw new Error('The ViewController\'s view does not exist. Classes of type ViewController must assign their view property to a class of type View in their constructors.');
		}

		// Append to this.view by default
		if(viewToAppendTo === null) {
			viewToAppendTo = this.view;
		}
		viewToAppendTo.append(viewController.view);

		return viewController;
	}

	static is(value) {
		return Class.isInstance(value, ViewController);
	}

}

// Export
export default ViewController;

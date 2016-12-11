// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';

// Class
class ViewController extends PropagatingEventEmitter {

	graphicalInterface = null;
	view = null;
	children = [];

	constructor() {
		// PropagatingEventEmitter
		super();

		// Don't do this as this is wasted work if the subclass of ViewController uses a custom view
		//this.view = new View();
	}

	initialize(graphicalInterface) {
		this.graphicalInterface = graphicalInterface;
		this.view.initialize();
	}

	descendFromParent(parentViewController) {
		this.parent = parentViewController;
		this.graphicalInterface = this.parent.graphicalInterface;

		return this;
	}

	append(viewController) {
		// Set the view controller's parent
		viewController.descendFromParent(this);

		// Add the view controller as a child
		this.children.append(viewController);

		// Append the view controller's view into the view heirarchy
		if(this.view === null) {
			throw new Error('The ViewController\'s view does not exist. Classes of type ViewController must assign their view property to a class of type View in their constructors.');
		}
		this.view.append(viewController.view);

		return viewController;
	}

	static is(value) {
		return Class.isInstance(value, ViewController);
	}

}

// Export
export default ViewController;

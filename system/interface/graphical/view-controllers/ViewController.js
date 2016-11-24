// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';

// Class
class ViewController extends PropagatingEventEmitter {

	graphicalInterface = null;
	view = null;
	children = [];

	constructor() {
		// PropagatingEventEmitter
		super();
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
		viewController.descendFromParent(this);
		this.children.append(viewController);

		return viewController;
	}

	static is(value) {
		return Class.isInstance(value, ViewController);
	}

}

// Export
export default ViewController;

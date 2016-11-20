// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';

// Class
class ViewController extends PropagatingEventEmitter {

	graphicalInterface = null;
	view = null;
	children = [];

	constructor() {
		super();

		// Try and establish the graphical interface
		this.establishGraphicalInterface();

		// Create the view for the view controller
		this.view = this.createView();

		// Initialize the view
		this.view.initialize();
	}

	establishGraphicalInterface(graphicalInterface) {
		// Use a passed graphical interface
		if(graphicalInterface !== undefined) {
			this.graphicalInterface = graphicalInterface;
		}
		// Check ancestors for a graphical interface to inherit
		else if(!this.graphicalInterface && this.parent) {
			var currentParent = this.parent;
			while(currentParent != null) {
				if(currentParent.graphicalInterface) {
					this.graphicalInterface = currentParent.graphicalInterface;
					break;
				}
				else if(currentParent.parent) {
					currentParent = currentParent.parent;
				}
				else {
					currentParent = null; // break
				}
			}
		}

		return this.graphicalInterface;
	}

	createView() {
		// This is the view for the view controller

		return null;
	}

	append(viewController) {
		this.children.append(viewController);

		return viewController;
	}

	static is(value) {
		return Class.isInstance(value, ViewController);
	}

}

// Export
export default ViewController;

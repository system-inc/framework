// Dependencies
import PropagatingEventEmitter from 'system/event/PropagatingEventEmitter.js';

// Class
class ViewController {

	graphicalInterface = null;
	view = null;
	subviews = {};

	constructor(graphicalInterface) {
		this.graphicalInterface = graphicalInterface;
		this.createView();
		this.createSubviews();
	}

	createView() {
	}

	createSubviews() {
	}

	initialize() {
		//this.graphicalInterface.on('graphicalInterface.initialized', function() {
		//	this.initialize();
		//}.bind(this));

		//this.graphicalInterface.initialize();
	}

}

// Export
export default ViewController;

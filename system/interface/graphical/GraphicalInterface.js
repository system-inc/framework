// Dependencies
import Interface from './../Interface.js';
import GraphicalInterfaceHistory from './GraphicalInterfaceHistory.js';

// Class
class GraphicalInterface extends Interface {

	// TODO: GraphicalInterfaces handle orientation changes and send messages to view controllers

	viewController = null;
	view = null;

	identifier = null;

	display = null;

	parent = null;
	child = null;

	title = null;
	icon = null;

	history = new GraphicalInterfaceHistory();

	closed = null;
	fullscreen = null;

	dimensions = {
		width: null,
		height: null,
		minimumWidth: null,
		minimumHeight: null,
		maximumWidth: null,
		maximumHeight: null,
	};

	position = {
		relativeToScreen: {
			x: null,
			y: null,
			coordinates: {
				topLeft: {
					x: null,
					y: null,
				},
				topCenter: {
					x: null,
					y: null,
				},
				topRight: {
					x: null,
					y: null,
				},

				leftCenter: {
					x: null,
					y: null,
				},

				rightCenter: {
					x: null,
					y: null,
				},

				bottomLeft: {
					x: null,
					y: null,
				},
				bottomCenter: {
					x: null,
					y: null,
				},
				bottomRight: {
					x: null,
					y: null,
				},

				center: {
					x: null,
					y: null,
				},
			},
			edges: {
				top: null,
				right: null,
				bottom: null,
				left: null,
			},
		},
	};

	constructor(identifier) {
		super();
		this.identifier = identifier;
	}

	intialize(viewController) {
		this.viewController = viewController;
		this.viewController.initialize();
		this.view = this.viewController.view;
	}

}

// Export
export default GraphicalInterface;

// Dependencies
import Interface from 'system/interface/Interface.js';
import GraphicalInterfaceHistory from 'system/interface/graphical/GraphicalInterfaceHistory.js';
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';

// Class
class GraphicalInterface extends Interface {

	adapter = null;

	identifier = null;

	title = null;
	icon = null;

	viewController = null;

	display = null;

	history = new GraphicalInterfaceHistory();

	closed = null;
	fullscreen = null;

	dimensions = new Dimensions();

	position = {
		relativeToDisplay: new Position(),
		relativeToAllDisplays: new Position(),
	};

	// TODO: GraphicalInterfaces handle orientation changes and send messages to view controllers

	constructor(identifier = String.uniqueIdentifier()) {
		super();

		this.identifier = identifier;
		app.log('this.identifier', this.identifier);
	}

	initialize(viewController) {
		this.viewController = viewController;
		this.viewController.graphicalInterface = this;
		this.viewController.initialize();
	}

}

// Export
export default GraphicalInterface;

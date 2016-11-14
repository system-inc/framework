// Dependencies
import Interface from 'system/interface/Interface.js';
import GraphicalInterfaceHistory from 'system/interface/graphical/GraphicalInterfaceHistory.js';
import Dimensions from 'system/interface/graphical/Dimensions.js';
import Position from 'system/interface/graphical/Position.js';
import ViewController from 'system/interface/graphical/view-controllers/ViewController.js';

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

	backgroundColor = null;
	useContentDimensions = null;

	resizable = null;
	movable = null;
	minimizable = null;
	maximizable = null;
	fullscreenable = null;
	closable = null;
	focusable = null;
	alwaysOnTop = null;

	// TODO: GraphicalInterfaces handle orientation changes and send messages to view controllers

	constructor(viewController, identifier = String.uniqueIdentifier()) {
		if(viewController === undefined || !ViewController.is(viewController)) {
			throw new Error('Must pass ViewController as first argument to GraphicalInterface constructor.');
		}

		// Interface is a PropagatingEventEmitter
		super();

		// Set the view controller
		this.viewController = viewController;

		// Establish the view controller's graphical interface
		this.viewController.establishGraphicalInterface(this);

		// Set the identifier
		this.identifier = identifier;
		//app.log('this.identifier', this.identifier);

		// Set the adapter from the graphical interface manager
		this.adapter = app.interfaces.graphicalInterfaceManager.createGraphicalInterfaceAdapter(this);

		// Initialize the graphical interface
		this.initialize();
	}

	initialize() {
		// Initialize the adapter
		this.adapter.initialize();
	}

}

// Export
export default GraphicalInterface;

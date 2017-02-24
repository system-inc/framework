// Dependencies
import Interface from 'framework/system/interface/Interface.js';
import GraphicalInterfaceHistory from 'framework/system/interface/graphical/GraphicalInterfaceHistory.js';
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';
import GraphicalInterfaceManager from 'framework/system/interface/graphical/GraphicalInterfaceManager.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// Class
class GraphicalInterface extends Interface {

	manager = null; // GraphicalInterfaceManager

	adapter = null;

	identifier = null;

	type = 'primary'; // primary, secondary, tertiary, etc.

	title = null;
	icon = null;

	viewController = null;

	display = null;
	displays = {};

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

	constructor() {
		// Interface is a PropagatingEventEmitter
		super();

		// Create the adapter for the graphical interface
		this.adapter = this.createGraphicalInterfaceAdapter();

		// Create a graphical interface manager
		this.manager = new GraphicalInterfaceManager();

		// Initialize the displays
		this.initializeDisplays();
	}

	initialize(viewController) {
		if(viewController === undefined || !ViewController.is(viewController)) {
			throw new Error('Must pass instance of ViewController as first argument to GraphicalInterface constructor.');
		}

		// Set the view controller
		this.viewController = viewController;

		// Initialize the view controller with a reference to this GraphicalInterface
		this.viewController.initialize(this);
		
		// Initialize the adapter
		this.adapter.initialize();
	}

	createViewAdapter(view) {
		//app.info('createViewAdapter', this.adapter);
		return this.adapter.createViewAdapter(view);
	}

	createGraphicalInterfaceAdapter() {
		var graphicalInterfaceAdapter = null;

		// If in Electron
		if(app.modules.electronModule && app.modules.electronModule.inElectronContext()) {
			//console.log('createGraphicalInterfaceAdapter - inElectronContext');
			var ElectronGraphicalInterfaceAdapter = require('framework/system/interface/graphical/adapters/electron/ElectronGraphicalInterfaceAdapter.js').default;
			graphicalInterfaceAdapter = new ElectronGraphicalInterfaceAdapter(this);
		}
		// If in a normal web browser
		else if(app.inWebContext()) {
			//console.log('createGraphicalInterfaceAdapter - inWebContext');
			var WebGraphicalInterfaceAdapter = require('framework/system/interface/graphical/managers/adapters/web/WebGraphicalInterfaceAdapter.js').default;
			graphicalInterfaceAdapter = new WebGraphicalInterfaceAdapter(this);
		}
		else {
			throw new Error('No suitable GraphicalInterfaceAdapter found.');
		}

		return graphicalInterfaceAdapter;
	}

	newGraphicalInterface() {
		return this.manager.newGraphicalInterface();
	}

	initializeDisplays() {
		//console.log('GraphicalInterface initializeDisplays');
		return this.adapter.initializeDisplays();
	}

}

// Export
export default GraphicalInterface;

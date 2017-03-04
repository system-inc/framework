// Dependencies
import Interface from 'framework/system/interface/Interface.js';
import GraphicalInterfaceHistory from 'framework/system/interface/graphical/GraphicalInterfaceHistory.js';
import Dimensions from 'framework/system/interface/graphical/Dimensions.js';
import Position from 'framework/system/interface/graphical/Position.js';
import GraphicalInterfaceManager from 'framework/system/interface/graphical/GraphicalInterfaceManager.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// Class
class GraphicalInterface extends Interface {

	children = [];

	manager = null; // GraphicalInterfaceManager

	adapter = null;

	identifier = null;

	type = 'primary'; // primary, secondary, tertiary, etc.

	title = null;
	icon = null;

	viewController = null;

	display = null;
	displays = {};

	state = null;

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

		// Initialize the state
		this.initializeState();

		// Create a graphical interface manager
		this.manager = new GraphicalInterfaceManager(this);
	}

	async initialize(viewController) {
		if(viewController === undefined || !ViewController.is(viewController)) {
			throw new Error('Must pass instance of ViewController as first argument to GraphicalInterface constructor.');
		}

		// Set the view controller
		this.viewController = viewController;

		// Initialize the view controller
		await this.viewController.initialize();
		
		// Initialize the adapter
		await this.adapter.initialize();
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

	async newGraphicalInterface(options = {}) {
		return await this.manager.newGraphicalInterface(options);
	}

	initializeState() {
		this.initializeDisplays();

		return this.adapter.initializeState();
	}

	initializeDisplays() {
		//console.log('GraphicalInterface initializeDisplays');
		return this.adapter.initializeDisplays();
	}

	toObject() {
		var identifier = this.identifier;

		var parentIdentifier = null;
		if(this.parent) {
			parentIdentifier = this.parent.identifier;
		}

		var childrenIdentifiers = [];
		this.children.each(function(index, child) {
			childrenIdentifiers.append(child.identifier);
		});

		return {
			identifier: this.identifier,
			parentIdentifier: parentIdentifier,
			childrenIdentifiers: childrenIdentifiers,
		};
	}

	close() {
		return this.adapter.close();
	}

	show() {
		return this.adapter.show();
	}

	openDeveloperTools() {
		return this.adapter.openDeveloperTools();
	}

}

// Export
export default GraphicalInterface;

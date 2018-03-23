// Dependencies
import Interface from 'framework/system/interface/Interface.js';
import GraphicalInterfaceHistory from 'framework/system/interface/graphical/GraphicalInterfaceHistory.js';
import GraphicalInterfaceManager from 'framework/system/interface/graphical/GraphicalInterfaceManager.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// Class
class GraphicalInterface extends Interface {

	settings = null;

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

	// TODO: GraphicalInterfaces handle orientation changes and send messages to view controllers

	constructor() {
		// Interface is a PropagatingEventEmitter
		super();

		// Create the adapter for the graphical interface
		this.adapter = this.createGraphicalInterfaceAdapter();

		// Initialize the state
		this.initializeState();

		// Handle display events
		this.handleDisplayEvents();
	}

	async initialize(viewController) {
		if(viewController !== undefined) {
			if(!ViewController.is(viewController)) {
				throw new Error('Must pass instance of ViewController as first argument to GraphicalInterface constructor.');
			}

			// Set the view controller
			this.viewController = viewController;

			// Initialize the view controller
			await this.viewController.initialize();
		}
		
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
			var ElectronGraphicalInterfaceAdapter = require('framework/modules/electron/interface/graphical/adapter/ElectronGraphicalInterfaceAdapter.js').default;
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

	handleDisplayEvents() {
		// Display added
		this.on('display.added', function(event) {
			console.log('display.added', event);

			// Apply default on display added
			if(this.state.settings.applyOn.contains('display.added')) {
				this.applyDefaultState();
			}
		}.bind(this));

		// Display removed
		this.on('display.removed', function(event) {
			console.log('display.removed', event);

			// Apply default on display removed
			if(this.state.settings.applyOn.contains('display.removed')) {
				this.applyDefaultState();
			}
		}.bind(this));
	
		// Display changed
		this.on('display.changed', function(event) {
			console.log('display.changed', event);

			// Apply default on display changed
			if(this.state.settings.applyOn.contains('display.changed')) {
				this.applyDefaultState();
			}
		}.bind(this));
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

	addEventListener(eventPattern, functionToBind, timesToRun) {
		this.adapter.addEventListener(...arguments);

		return super.addEventListener(...arguments);
	}

	removeEventListener() {
		this.adapter.removeEventListener(...arguments);

		return super.removeEventListener(...arguments);
	}

	removeAllEventListeners() {
		this.adapter.removeAllEventListeners(...arguments);

		return super.removeAllEventListeners(...arguments);
	}

	getSelection() {
		return this.adapter.getSelection(...arguments);
	}

	insertText() {
		return this.adapter.insertText(...arguments);
	}

	print() {
		return this.adapter.print(...arguments);
	}

	close() {
		return this.adapter.close(...arguments);
	}

	destroy() {
		return this.adapter.destroy(...arguments);	
	}

	show() {
		return this.adapter.show(...arguments);
	}

	openDeveloperTools() {
		return this.adapter.openDeveloperTools(...arguments);
	}

	closeDeveloperTools() {
		return this.adapter.closeDeveloperTools(...arguments);
	}

	toggleDeveloperTools() {
		return this.adapter.toggleDeveloperTools(...arguments);
	}

	reload() {
		return this.adapter.reload(...arguments);
	}

	reset() {
		return this.adapter.reset(...arguments);
	}

	applyDefaultState() {
		//console.info('GraphicalInterface applyDefaultState');
		return this.state.applyDefault();
	}

}

// Export
export default GraphicalInterface;

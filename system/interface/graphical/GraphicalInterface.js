// Dependencies
import Interface from 'framework/system/interface/Interface.js';
import GraphicalInterfaceManager from 'framework/system/interface/graphical/GraphicalInterfaceManager.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';

// TODO: GraphicalInterfaces handle orientation changes and send messages to view controllers

// Class
class GraphicalInterface extends Interface {

	manager = null; // GraphicalInterfaceManager

	adapter = null;

	identifier = null;

	type = 'primary'; // primary, secondary, tertiary, any custom type

	title = null;
	icon = null;

	viewController = null;

	state = null;

	constructor(parent, type) {
		super(parent);

		// Set the type
		if(type) {
			this.type = type;
		}

		console.log('GraphicalInterface', 'type', this.type);
	}

	async initialize() {
		// Handle child graphical interfaces
		if(this.parent !== null) {
			// Reference the existing GraphicalInterfaceManager
			this.manager = this.parent.manager;
		}
		// If there is no parent
		else {
			// Create a graphical interface manager	
			this.manager = new GraphicalInterfaceManager(this);
		}

		// Create the adapter for the graphical interface
		this.adapter = await this.createGraphicalInterfaceAdapter();

		// Handle display events
		this.handleDisplayEvents();
	}

	createViewAdapter(view) {
		//console.info('createViewAdapter', this.adapter);

		var viewAdapter = this.adapter.createViewAdapter(view);

		return viewAdapter;
	}

	async createGraphicalInterfaceAdapter() {
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

		// If the graphical interface has a parent, then we need to create a new source graphical interface and not initialize into the existing one
		var useExistingSourceGraphicalInterface = true;
		if(this.parent !== null) {
			//console.info('A parent graphical interface exists so we must create a new source graphical interface instead of initializing into the existing one.');
			useExistingSourceGraphicalInterface = false;
		}
		else {
			//console.info('A parent graphical interface does not exist so we will initialize into the existing source graphical interface.');
		}

		// Initialize the graphical interface adapter
		//console.info('Initializing graphical interface adapter');
		await graphicalInterfaceAdapter.initialize(useExistingSourceGraphicalInterface);

		return graphicalInterfaceAdapter;
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

	async setViewController(viewController) {
		//console.log('setViewController', viewController);

		// Set the view controller
		this.viewController = viewController;

		// Initialize the view controller
		await this.viewController.initialize();

		// Have the adapter update the view controller
		this.adapter.updateViewController();
	}

	toObject() {
		var identifier = this.identifier;

		var parentIdentifier = null;
		if(this.parent) {
			parentIdentifier = this.parent.identifier;
		}

		return {
			identifier: this.identifier,
			parentIdentifier: parentIdentifier,
		};
	}

	applyDefaultState() {
		//console.info('GraphicalInterface applyDefaultState');
		return this.state.applyDefault();
	}

	// Bind addEventListener to the adapter
	addEventListener(eventPattern, functionToBind, timesToRun) {
		//console.log('add event listener!');
		this.adapter.addEventListener(...arguments);

		return super.addEventListener(...arguments);
	}

	// Bind removeEventListener to the adapter
	removeEventListener() {
		this.adapter.removeEventListener(...arguments);

		return super.removeEventListener(...arguments);
	}

	// Bind removeAllEventListeners to the adapter
	removeAllEventListeners() {
		this.adapter.removeAllEventListeners(...arguments);

		return super.removeAllEventListeners(...arguments);
	}

	// Bind getSelection to the adapter
	getSelection() {
		return this.adapter.getSelection(...arguments);
	}

	// Bind insertText to the adapter
	insertText() {
		return this.adapter.insertText(...arguments);
	}

	// Bind print to the adapter
	print() {
		return this.adapter.print(...arguments);
	}

	// Bind close to the adapter
	close() {
		return this.adapter.close(...arguments);
	}

	// Bind destroy to the adapter
	destroy() {
		return this.adapter.destroy(...arguments);	
	}

	// Bind show to the adapter
	show() {
		return this.adapter.show(...arguments);
	}

	// Bind openDeveloperTools to the adapter
	openDeveloperTools() {
		return this.adapter.openDeveloperTools(...arguments);
	}

	// Bind closeDeveloperTools to the adapter
	closeDeveloperTools() {
		return this.adapter.closeDeveloperTools(...arguments);
	}

	// Bind toggleDeveloperTools to the adapter
	toggleDeveloperTools() {
		return this.adapter.toggleDeveloperTools(...arguments);
	}

	// Bind reload to the adapter
	reload() {
		return this.adapter.reload(...arguments);
	}

	// Bind reset to the adapter
	reset() {
		return this.adapter.reset(...arguments);
	}

}

// Export
export default GraphicalInterface;

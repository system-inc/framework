// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
import GraphicalInterface from 'framework/system/interface/graphical/GraphicalInterface.js';

// Class
class GraphicalInterfaceManager extends EventEmitter {

	graphicalInterfaces = [];
	macOsApplicationMenu = null;

	constructor(firstGraphicalInterface) {
		super();

		// Keep a reference to the first graphical interface
		this.graphicalInterfaces.append(firstGraphicalInterface);

		// Discover all of the other graphical interfaces
		this.discoverGraphicalInterfaces();
	}

	discoverGraphicalInterfaces() {
		console.info('Remove the following commented code block - When the graphical interface manager is constructed, it should broadcast to app session storage and see if there are any other windows and contstruct references to them');
		//// Listen to all changes to local storage from other tabs and windows
		//this.localStorage.on('localStorage.change', function(event) {
		//	//console.info('localStorage.change event data', event.data.newValue);
		//	var graphicalInterfaceEvent = event.data.newValue;

		//	// If a different window or tab saves a graphical interface event into local storage
		//	if(event.data.key === 'app.interfaces.graphical.manager.lastEvent') {
		//		//console.info('proxies', this.proxies);
		//		//console.info('proxy for event should be '+graphicalInterfaceEvent.graphicalInterface.identifier+' :', this.proxies[graphicalInterfaceEvent.graphicalInterface.identifier]);

		//		// Emit the event on the graphical interface proxy
		//		if(this.proxies[graphicalInterfaceEvent.graphicalInterface.identifier]) {
		//			//console.info('emitting but not broadcasting', graphicalInterfaceEvent.identifier);

		//			var data = {
		//				broadcastEvent: false, // Make sure when we emit the event we do not save that event to local storage otherwise we get into an infinite loop
		//			}.merge(graphicalInterfaceEvent.data);

		//			this.proxies[graphicalInterfaceEvent.graphicalInterface.identifier].emit(graphicalInterfaceEvent.identifier, data);
		//		}
		//	}
		//}.bind(this));
	}

	async newGraphicalInterface(type = null) {
		//console.info('A new graphical interface is being created...');

		// Create and initialize the graphical interface
		var graphicalInterface = new GraphicalInterface(app.interfaces.graphical, type); // A reference to the parent must be passed
		await graphicalInterface.initialize();

		// Keep track of the graphical interface
		this.graphicalInterfaces.append(graphicalInterface);

		return graphicalInterface;
	}

	getMacOsApplicationMenu() {
		return this.macOsApplicationMenu;
	}

	setMacOsApplicationMenu(macOsApplicationMenu) {
		this.macOsApplicationMenu = macOsApplicationMenu;

		return this.macOsApplicationMenu;
	}

	// TODO: Remove these comments

	//	appGraphicalInterface.on('graphicalInterface.reload', function() {
	//		//console.log('reload');
	//		appGraphicalInterface.reload();
	//	});

	//	appGraphicalInterface.on('graphicalInterface.close', function() {
	//		//console.log('close');
	//		appGraphicalInterface.close();
	//	});

	//	appGraphicalInterface.on('graphicalInterface.show', function() {
	//		//console.log('show');
	//		appGraphicalInterface.show();
	//	});

	//	appGraphicalInterface.on('graphicalInterface.openDeveloperTools', function() {
	//		//console.log('openDeveloperTools');
	//		appGraphicalInterface.openDeveloperTools();
	//	});

	//	appGraphicalInterface.on('graphicalInterface.closeDeveloperTools', function() {
	//		//console.log('closeDeveloperTools');
	//		appGraphicalInterface.closeDeveloperTools();
	//	});

	//	appGraphicalInterface.on('graphicalInterface.toggleDeveloperTools', function() {
	//		//console.log('toggleDeveloperTools');
	//		appGraphicalInterface.toggleDeveloperTools();
	//	});


	//async newGraphicalInterface(options = {}) {
	//	// Use the current graphical interface's adapter to create a new graphical interface
	//	var graphicalInterfaceProxy = await app.interfaces.graphical.adapter.newGraphicalInterface(options);

	//	return this.addGraphicalInterfaceProxy(graphicalInterfaceProxy);
	//}

	//addGraphicalInterfaceProxy(graphicalInterfaceProxy) {
	//	// Store a refrence to the new proxy
	//	this.proxies[graphicalInterfaceProxy.identifier] = graphicalInterfaceProxy;

	//	graphicalInterfaceProxy.on('*', function(event) {
	//		//console.info('event', event);

	//		var shouldBroadcastEvent = true;
	//		if(event.graphicalInterface) {
	//			shouldBroadcastEvent = false;	
	//		}
	//		else if(event.data && event.data.broadcastEvent === false) {
	//			shouldBroadcastEvent = false;
	//		}

	//		if(shouldBroadcastEvent) {
	//			//console.info('Broadcasting event:', event.identifier, event);

	//			var eventObject = {
	//				identifier: event.identifier,
	//				graphicalInterface: {
	//					identifier: graphicalInterfaceProxy.identifier,
	//					parentIdentifier: graphicalInterfaceProxy.parentIdentifier,
	//				},
	//				data: event.data,
	//			};

	//			LocalStorage.set('app.interfaces.graphical.manager.lastEvent', eventObject);
	//		}
	//	});

	//	return graphicalInterfaceProxy;
	//}

	//removeGraphicalInterface(graphicalInterfaceProxy) {
	//	// Delete any existing data in local storage for the proxy identifier
	//	LocalStorage.delete('app.interfaces.graphical.'+graphicalInterfaceProxy.identifier);

	//	delete this.proxies[graphicalInterfaceProxy.identifier];
	//}

}

// Export
export default GraphicalInterfaceManager;

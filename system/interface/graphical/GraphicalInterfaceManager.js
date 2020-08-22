// Dependencies
import EventEmitter from 'framework/system/event/EventEmitter.js';
//import GraphicalInterface from 'framework/system/interface/graphical/GraphicalInterface.js';

// Class
class GraphicalInterfaceManager extends EventEmitter {

	graphicalInterfaces = [];

	async initialize() {
		// The manager uses app session datastore to configure the contextual graphical interface and discover other graphical interfaces

		// Discover all of the other graphical interfaces
		console.error('Discover all of the other graphical interfaces');

		// Listen to changes to graphical interfaces to stay in sync
		console.error('Listen to changes to graphical interfaces to stay in sync');
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

	async registerGraphicalInterface(graphicalInterface) {
		console.log('registerGraphicalInterface');

		console.error('Set parent, type, and identifier')

		// Something like this
		var registration = {
			parentIdentifier: graphicalInterface.parent ? graphicalInterface.parent.identifier : null,
			identifier: graphicalInterface.identifier,
			type: graphicalInterface.type,
		};
		console.error('registration', registration);
	}

	async initializeGraphicalInterface(graphicalInterface) {
		console.error('GraphicalInterfaceManager .initializeGraphicalInterface()');

		console.error('read the registration object from app session store');		

		// Determine if the contextual graphical interface has a parent
		console.error('Determine if the graphical interface has a parent');

		// Determine if the contextual graphical interface has a type
		console.error('Determine if the graphical interface has a type');

		// Determine if the contextual graphical interface has an identifier
		console.error('Determine if the graphical interface has an identifier');
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

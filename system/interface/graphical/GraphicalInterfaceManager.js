// Dependencies
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class GraphicalInterfaceManager {

	localStorage = null;
	proxies = {};

	constructor(appGraphicalInterface) {
		appGraphicalInterface.on('graphicalInterface.reload', function() {
			//console.log('reload');
			appGraphicalInterface.reload();
		});

		appGraphicalInterface.on('graphicalInterface.close', function() {
			//console.log('close');
			appGraphicalInterface.close();
		});

		appGraphicalInterface.on('graphicalInterface.show', function() {
			//console.log('show');
			appGraphicalInterface.show();
		});

		appGraphicalInterface.on('graphicalInterface.openDeveloperTools', function() {
			//console.log('openDeveloperTools');
			appGraphicalInterface.openDeveloperTools();
		});

		this.addGraphicalInterfaceProxy(appGraphicalInterface);

		this.localStorage = new LocalStorage();

		// Listen to all changes to local storage from other tabs and windows
		this.localStorage.on('localStorage.change', function(event) {
			//console.info('localStorage.change event data', event.data.newValue);
			var graphicalInterfaceEvent = event.data.newValue;

			// If a different window or tab saves a graphical interface event into local storage
			if(event.data.key === 'app.interfaces.graphical.manager.lastEvent') {
				//console.info('proxies', this.proxies);
				//console.info('proxy for event should be '+graphicalInterfaceEvent.graphicalInterface.identifier+' :', this.proxies[graphicalInterfaceEvent.graphicalInterface.identifier]);

				// Emit the event on the graphical interface proxy
				if(this.proxies[graphicalInterfaceEvent.graphicalInterface.identifier]) {
					//console.info('emitting but not broadcasting', graphicalInterfaceEvent.identifier);

					var data = {
						broadcastEvent: false, // Make sure when we emit the event we do not save that event to local storage otherwise we get into an infinite loop
					}.merge(graphicalInterfaceEvent.data);

					this.proxies[graphicalInterfaceEvent.graphicalInterface.identifier].emit(graphicalInterfaceEvent.identifier, data);
				}
			}
		}.bind(this));
	}

	async newGraphicalInterface(options = {}) {
		// Use the current graphical interface's adapter to create a new graphical interface
		var graphicalInterfaceProxy = await app.interfaces.graphical.adapter.newGraphicalInterface(options);

		return this.addGraphicalInterfaceProxy(graphicalInterfaceProxy);
	}

	addGraphicalInterfaceProxy(graphicalInterfaceProxy) {
		// Store a refrence to the new proxy
		this.proxies[graphicalInterfaceProxy.identifier] = graphicalInterfaceProxy;

		graphicalInterfaceProxy.on('*', function(event) {
			//console.info('event', event);

			var shouldBroadcastEvent = true;
			if(event.graphicalInterface) {
				shouldBroadcastEvent = false;	
			}
			else if(event.data && event.data.broadcastEvent === false) {
				shouldBroadcastEvent = false;
			}

			if(shouldBroadcastEvent) {
				//console.info('Broadcasting event:', event.identifier, event);

				var eventObject = {
					identifier: event.identifier,
					graphicalInterface: {
						identifier: graphicalInterfaceProxy.identifier,
						parentIdentifier: graphicalInterfaceProxy.parentIdentifier,
					},
					data: event.data,
				};

				LocalStorage.set('app.interfaces.graphical.manager.lastEvent', eventObject);
			}
		});

		return graphicalInterfaceProxy;
	}

	removeGraphicalInterface(graphicalInterfaceProxy) {
		// Delete any existing data in local storage for the proxy identifier
		LocalStorage.delete('app.interfaces.graphical.'+graphicalInterfaceProxy.identifier);

		delete this.proxies[graphicalInterfaceProxy.identifier];
	}

	getChildren() {
		var children = [];

		var currentGraphicalInterface = app.interfaces.graphical;
	}

	getParent() {
		var parent = null;



		return parent;
	}

}

// Export
export default GraphicalInterfaceManager;

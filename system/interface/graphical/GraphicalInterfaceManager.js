// Dependencies
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class GraphicalInterfaceManager {

	proxies = {};

	constructor(appGraphicalInterface) {
		this.addGraphicalInterfaceProxy(appGraphicalInterface);

		// This only catches events when other tabs mess with local storage
		window.addEventListener('storage', function(event) {
			if(event.key === 'app.interfaces.graphical.manager.lastEvent') {
				var eventData = Json.decode(event.newValue);
				console.log('window storage event', eventData);
				//console.log(this.proxies[eventData.graphicalInterfaceIdentifier]);

				if(this.proxies[eventData.graphicalInterfaceIdentifier]) {
					//console.log('re-emitting', eventData.eventIdentifier);
					this.proxies[eventData.graphicalInterfaceIdentifier].emit(eventData.eventIdentifier, {
						doNotSaveToLocalStorage: true,
					});
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

			if(
				event.identifier !== 'eventEmitter.addedEventListener' &&
				event.data === null
			) {
					var eventObject = {
						graphicalInterfaceIdentifier: graphicalInterfaceProxy.identifier,
						graphicalInterfaceParentIdentifier: graphicalInterfaceProxy.parentIdentifier,
						eventIdentifier: event.identifier,
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

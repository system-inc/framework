// Dependencies
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class GraphicalInterfaceManager {

	proxies = {};

	constructor() {
		
		
		window.addEventListener('storage', function(event) {
			console.log('window storage event', event);
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

		// Delete any existing data in local storage for the proxy identifier
		LocalStorage.delete('app.interfaces.graphical.'+graphicalInterfaceProxy.identifier);

		// Set the new one
		LocalStorage.set('app.interfaces.graphical.'+graphicalInterfaceProxy.identifier, graphicalInterfaceProxy.toObject());

		return graphicalInterfaceProxy;
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

// Dependencies
import LocalStorage from 'framework/system/interface/graphical/web/data/LocalStorage.js';

// Class
class GraphicalInterfaceManager {

	proxies = [];

	constructor() {
		// Find out all of the graphical interfaces that exist by referencing LocalStorage
		//var possiblyExistingGraphicalInterfacesMetadata = LocalStorage.get('app.interfaces.graphical');
		//var verifiedGraphicalInterfaces = {};
		//console.info('possiblyExistingGraphicalInterfacesMetadata', possiblyExistingGraphicalInterfacesMetadata);

		//// Create graphical interface proxies for existing graphical interfaces
		//possiblyExistingGraphicalInterfacesMetadata.each(function(possiblyExistingGraphicalInterfaceIdentifier, possiblyExistingGraphicalInterfaceMetadata) {
		//	var graphicalInterfaceProxy = new GraphicalInterfaceProxy({
		//		identifier: possiblyExistingGraphicalInterfaceIdentifier,
		//		useExistingGraphicalInterfaceSource: true,
		//	});

		//	if(graphicalInterfaceProxy.exists()) {
		//		this.addGraphicalInterface(graphicalInterface);

		//		if(graphicalInterface.adapter.isCurrentGraphicalInterface) {
		//			this.graphicalInterface = graphicalInterface;
		//		}
		//	}
		//	else {
		//		console.log('need to remove');
		//	}
		//}.bind(this));

		//// If we did not find a graphical interface for the current one, this must be a new one
		//if(this.graphicalInterface === null) {
		//	// Construct an object to represent this graphical interface
		//	this.graphicalInterface = this.addGraphicalInterface(new GraphicalInterface({
		//		useExistingGraphicalInterfaceSource: true,
		//	}));
		//}

		// Store the graphical interface information in local storage
		//LocalStorage.set('app.interfaces.graphical', graphicalInterfaces);
		//console.info("LocalStorage.get('app.interfaces.graphical')", LocalStorage.get('app.interfaces.graphical'));
	}

	newGraphicalInterface() {
		// Use the current graphical interface's adapter to create a new graphical interface
		var graphicalInterfaceProxy = app.interfaces.graphical.adapter.newGraphicalInterface();



		return this.addGraphicalInterface(new GraphicalInterface());
	}

}

// Export
export default GraphicalInterfaceManager;

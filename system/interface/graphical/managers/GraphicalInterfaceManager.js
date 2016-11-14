// Dependencies
import GraphicalInterface from 'system/interface/graphical/GraphicalInterface.js';

// Class
class GraphicalInterfaceManager {

	interfaces = null; // This is set in constructor

	constructor() {
		// Make sure the app has a graphical interfaces object
		if(!app.interfaces.graphical) {
			app.interfaces.graphical = {};
		}

		this.interfaces = app.interfaces.graphical;
	}

	create(viewController) {
		var graphicalInterface = new GraphicalInterface(viewController);

		return this.add(graphicalInterface);
	}

	add(graphicalInterface) {
		this.interfaces[graphicalInterface.identifier] = graphicalInterface;

		return graphicalInterface;
	}

	getGraphicalInterfaceAdapter(graphicalInterface) {
		throw new Error('This method must be implemented by a child class of GraphicalInterfaceManager.');
	}

	getViewAdapter(view) {
		throw new Error('This method must be implemented by a child class of GraphicalInterfaceManager.');
	}

}

// Export
export default GraphicalInterfaceManager;

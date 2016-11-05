// Dependencies
import GraphicalInterface from './GraphicalInterface.js';
import Settings from './../../system/settings/Settings.js';

// Class
class GraphicalInterfaceManager {

	graphicalInterfaces = null;

	constructor(graphicalInterfaces = {}) {
		this.graphicalInterfaces = graphicalInterfaces;
	}

}

// Export
export default GraphicalInterfaceManager;

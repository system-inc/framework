// Class
class GraphicalInterfaceManager {

	interfaces = null;

	constructor() {
		this.interfaces = app.interfaces.graphical;
	}

	add(graphicalInterface) {
		this.interfaces[graphicalInterface.identifier] = graphicalInterface;
	}

}

// Export
export default GraphicalInterfaceManager;

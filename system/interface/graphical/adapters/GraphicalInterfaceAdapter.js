// Class
class GraphicalInterfaceAdapter {

	graphicalInterface = null;

	constructor(graphicalInterface) {
		this.graphicalInterface = graphicalInterface;
	}

	async initialize() {
		throw new Error('This method must be implemented by a child class.');
	}

	newGraphicalInterface(graphicalInterface) {
		throw new Error('This method must be implemented by a child class.');
	}

}

// Export
export default GraphicalInterfaceAdapter;

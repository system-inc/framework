// Class
class GraphicalInterfaceAdapter {

	graphicalInterface = null;

	constructor(graphicalInterface) {
		this.graphicalInterface = graphicalInterface;
	}

	async initialize() {
		throw new Error('This method must be implemented by a child class.');
	}

	async newGraphicalInterface(options) {
		throw new Error('This method must be implemented by a child class.');
	}

	getSelection() {
		throw new Error('This method must be implemented by a child class.');	
	}

}

// Export
export default GraphicalInterfaceAdapter;

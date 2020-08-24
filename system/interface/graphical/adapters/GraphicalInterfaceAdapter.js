// Class
class GraphicalInterfaceAdapter {

	graphicalInterface = null;

	// The root view, which is an adapted view
	view = null;

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
export { GraphicalInterfaceAdapter };

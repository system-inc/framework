// Dependencies

// Class
class GraphicalInterfaceAdapter {

	graphicalInterface = null;

	constructor(graphicalInterface) {
		this.graphicalInterface = graphicalInterface;
	}

	initialize() {
		throw new Error('This method must be implemted by a child class.');
	}

}

// Export
export default GraphicalInterfaceAdapter;

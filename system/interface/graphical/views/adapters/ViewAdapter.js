// Class
class ViewAdapter {

	view = null;

	constructor(view) {
		this.view = view;
	}

	append() {
		throw new Error('This method must be implemted by a child class.');
	}

	prepend() {
		throw new Error('This method must be implemted by a child class.');
	}

	addClass() {
		throw new Error('This method must be implemted by a child class.');
	}

}

// Export
export default ViewAdapter;

// Class
class ViewAdapter {

	view = null;

	constructor(view) {
		this.view = view;
	}

	listen() {
		// Does nothing by default
	}

	append() {
		throw new Error('append() must be implemented by a child class of ViewAdapter.');
	}

	prepend() {
		throw new Error('prepend() must be implemented by a child class of ViewAdapter.');
	}

	addClass() {
		throw new Error('addClass() must be implemented by a child class of ViewAdapter.');
	}

	show() {
		throw new Error('show() must be implemented by a child class of ViewAdapter.');
	}

	hide() {
		throw new Error('hide() must be implemented by a child class of ViewAdapter.');
	}

	focus() {
		throw new Error('focus() must be implemented by a child class of ViewAdapter.');
	}

	select() {
		throw new Error('select() must be implemented by a child class of ViewAdapter.');
	}

	getSelectionText() {
		throw new Error('getSelectionText() must be implemented by a child class of ViewAdapter.');
	}

	press() {
		throw new Error('press() must be implemented by a child class of ViewAdapter.');
	}

}

// Export
export default ViewAdapter;

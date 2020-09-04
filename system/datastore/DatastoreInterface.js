// Dependencies
import { PropagatingEventEmitter } from '@framework/system/event/PropagatingEventEmitter.js';

// Class
class DatastoreInterface extends PropagatingEventEmitter {

	get(path = null) {
		throw new Error('This method must be implemented by a child class.');
	}

	set(path, value) {
		throw new Error('This method must be implemented by a child class.');
	}

	delete(path) {
		throw new Error('This method must be implemented by a child class.');
	}

	getData() {
		throw new Error('This method must be implemented by a child class.');
	}

	setData(data) {
		throw new Error('This method must be implemented by a child class.');
	}

	empty() {
		throw new Error('This method must be implemented by a child class.');
	}

	inherit(data) {
		throw new Error('This method must be implemented by a child class.');
	}

	merge(data) {
		throw new Error('This method must be implemented by a child class.');
	}

	integrate(data) {
		throw new Error('This method must be implemented by a child class.');
	}

}

// Export
export { DatastoreInterface };

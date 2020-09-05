// Dependencies
import { DatastoreInterface } from '@framework/system/datastore/DatastoreInterface.js';

// Class
class Datastore extends DatastoreInterface {

	data = {};

	get(path = null) {
		var value = null;

		// Calling get() with no path will return data
		if(path === null) {
			value = this.data;
		}
		else {
			value = this.data.getValueByPath(path);
		}

		return value;
	}

	set(path, value) {
		this.data.setValueByPath(path, value);

		return value;
	}

	delete(path) {
		this.data.deleteValueByPath(path);

		return true;
	}

	getData() {
		return this.data;
	}

	setData(data) {
		this.empty();

		if(data && Object.is(data)) {
			data.each(function(key, value) {
				this.set(key, value);
			}.bind(this));	
		}

		return this.data;
	}

	empty() {
		this.data = {};

		return this.data;
	}

	inherit(data) {
		return this.data.inherit(data);
	}

	merge(data) {
		return this.data.merge(data);
	}

	integrate(data) {
		return this.data.integrate(data);
	}

}

// Export
export { Datastore };

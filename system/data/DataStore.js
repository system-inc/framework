// Class
class DataStore {

	data = {};

	get(path) {
		return this.data.getValueByPath(path);
	}

	set(path, value) {
		return this.data.setValueByPath(path, value);
	}

	delete(path) {
		return this.data.deleteValueByPath(path);
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

	merge(data) {
		return this.data.merge(data);
	}

	integrate(data) {
		return this.data.integrate(data);
	}

}

// Export
export default DataStore;

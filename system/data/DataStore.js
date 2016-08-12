// Class
var DataStore = Class.extend({

	data: {},

	getData: function() {
		return this.data;
	},

	setData: function(data) {
		this.empty();

		if(data && Object.is(data)) {
			data.each(function(key, value) {
				this.set(key, value);
			}.bind(this));	
		}

		return this.data;
	},

	empty: function() {
		this.data = {};

		return this.data;
	},

	merge: function(data) {
		return this.data.merge(data);
	},

	integrate: function(data) {
		return this.data.integrate(data);
	},

	get: function(path) {
		return this.data.getValueByPath(path);
	},

	set: function(path, value) {
		return this.data.setValueByPath(path, value);
	},

	delete: function(path) {
		return this.data.deleteValueByPath(path, value);
	},

});

// Export
module.exports = DataStore;
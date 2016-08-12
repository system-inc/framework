// Dependencies
var File = Framework.require('system/file-system/File.js');
var DataStore = Framework.require('system/data/DataStore.js');

// Class
var Settings = Class.extend({

	dataStore: null,
	defaults: null,

	construct: function(defaultData, data, dataStore) {
		// Create a new data store if none was provided
		if(dataStore === undefined) {
			dataStore = new DataStore();
		}

		// Set the data store
		this.dataStore = dataStore;
		Console.standardLog('this.dataStore', this.dataStore);

		// Set the defaults
		this.setDefaults(defaultData);

		// Set the initial data for the data store
		this.dataStore.merge(data);
	},

	setDefaults: function(defaultData) {
		if(defaultData) {
			// Save the defaultData
			this.defaults = defaultData.clone();

			// Get the current data
			var data = this.dataStore.getData();

			// Set the data to the default data
			this.dataStore.setData(this.defaults);

			// Merge the current data on top of the defaults
			this.dataStore.merge(data);
		}
	},

	merge: function(data) {
		return this.dataStore.merge(data);
	},

	mergeFromFile: function(datafilePath) {
		// Read the data from the file
		var data = File.synchronous.read.json(datafilePath);
		//Console.log('Settings from', datafilePath, 'to merge:', dataStore);

		return this.merge(data);
	},

	integrate: function(data) {
		return this.dataStore.integrate(data);
	},

	integrateFromFile: function(datafilePath) {
		// Read the data from the file
		var data = File.synchronous.read.json(datafilePath);
		//Console.log('Settings from', datafilePath, 'to integrate:', dataStore);
		
		this.integrate(data);
	},

	get: function(path) {
		return this.dataStore.get(path);
	},

	set: function(path, value) {
		return this.dataStore.set(path, value);
	},

});

// Static methods

Settings.constructFromFile = function(defaultData, datafilePath, dataStore) {
	//Console.log('datafilePath', datafilePath);

	// Read the data from the file
	var data = File.synchronous.read.json(datafilePath);

	//Console.log('dataStore', dataStore);

	// Create a new settings object with the data
	var settings = new Settings(defaultData, data, dataStore);

	return settings;
};

// Export
module.exports = Settings;
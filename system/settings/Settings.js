// Dependencies
import File from 'framework/system/file-system/File.js';
import DataStore from 'framework/system/data/DataStore.js';

// Class
class Settings {

	dataStore = null;
	defaults = null;

	constructor(defaults = {}, data = {}, dataStore = new DataStore()) {
		// Set the data store
		this.dataStore = dataStore;
		//console.log('this.dataStore', this.dataStore);

		// Set the defaults
		this.setDefaults(defaults);

		// Set the initial data for the data store
		this.merge(data);
	}

	setDefaults(defaults) {
		if(defaults) {
			// Set the defaults to a clone of defaults
			this.defaults = defaults.clone();

			// Apply the defaults to the current data store
			this.applyDefaults();
		}

		return this;
	}

	mergeDefaults(defaultsToMerge) {
		// Merge in the new defaults to the existing defaults
		this.defaults.merge(defaultsToMerge);

		// Apply the defaults to the current data store
		this.applyDefaults();

		return this;
	}

	applyDefaults() {
		// Get the current data
		var data = this.dataStore.getData();
		//console.log('data', data);

		// Set the data to the default data
		this.dataStore.setData(this.defaults);

		// Merge the current data on top of the defaults
		this.dataStore.merge(data);

		return this;
	}

	reset() {
		this.delete();
		this.applyDefaults();
	}

	merge(settingsOrData) {
		var dataToMerge = settingsOrData;

		// Handle if settingsOrData is an instance of Settings
		if(Settings.is(settingsOrData)) {
			dataToMerge = settingsOrData.getData();
		}

		return this.dataStore.merge(dataToMerge);
	}

	async mergeFromFile(dataFilePath) {
		// Read the data from the file
		var data = await File.readAndDecodeJson(dataFilePath);
		//console.log('Settings from', dataFilePath, 'to merge:', data);

		return this.merge(data);
	}

	integrate(data) {
		return this.dataStore.integrate(data);
	}

	async integrateFromFile(dataFilePath) {
		//app.log('integrateFromFile', dataFilePath);

		try {
			// Read the data from the file
			var data = await File.readAndDecodeJson(dataFilePath);
			//console.log('Settings from', dataFilePath, 'to integrate:', data);
			
			this.integrate(data);
		}
		catch(error) {
			//console.error('No file at '+dataFilePath);
		}
	}

	get(path) {
		return this.dataStore.get(path);
	}

	set(path, value) {
		return this.dataStore.set(path, value);
	}

	delete(path) {
		return this.dataStore.delete(path);
	}

	static async constructFromFile(defaults, dataFilePath, dataStore) {
		//console.log('dataFilePath', dataFilePath);

		// Read the data from the file
		var data = await File.readAndDecodeJson(dataFilePath);
		//console.log('data', data);

		//console.log('dataStore', dataStore);

		// Create a new settings object with the data
		var settings = new Settings(defaults, data, dataStore);

		return settings;
	}

	static is = function(value) {
		return Class.isInstance(value, Settings);
	}

}

// Export
export default Settings;

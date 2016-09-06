// Dependencies
import File from './../../system/file-system/File.js';
import DataStore from './../../system/data/DataStore.js';

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
		this.dataStore.merge(data);
	}

	setDefaults(defaults) {
		if(defaults) {
			// Set the defaults to a clone of defaults
			this.defaults = defaults.clone();

			// Apply the defaults to the current data store
			this.applyDefaults();
		}
	}

	mergeDefaults(defaultsToMerge) {
		// Merge in the new defaults to the existing defaults
		this.defaults.merge(defaultsToMerge);

		// Apply the defaults to the current data store
		this.applyDefaults();
	}

	applyDefaults() {
		// Get the current data
		var data = this.dataStore.getData();
		//console.log('data', data);

		// Set the data to the default data
		this.dataStore.setData(this.defaults);

		// Merge the current data on top of the defaults
		this.dataStore.merge(data);
	}

	merge(data) {
		return this.dataStore.merge(data);
	}

	async mergeFromFile(datafilePath) {
		// Read the data from the file
		var data = await File.readAndDecodeJson(datafilePath);
		//console.log('Settings from', datafilePath, 'to merge:', data);

		return this.merge(data);
	}

	integrate(data) {
		return this.dataStore.integrate(data);
	}

	async integrateFromFile(datafilePath) {
		try {
			// Read the data from the file
			var data = await File.readAndDecodeJson(datafilePath);
			//console.log('Settings from', datafilePath, 'to integrate:', data);
			
			this.integrate(data);
		}
		catch(error) {
			//console.error('--- no file at '+datafilePath);
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

	static async constructFromFile(defaults, datafilePath, dataStore) {
		//console.log('datafilePath', datafilePath);

		// Read the data from the file
		var data = await File.readAndDecodeJson(datafilePath);
		//console.log('data', data);

		//console.log('dataStore', dataStore);

		// Create a new settings object with the data
		var settings = new Settings(defaults, data, dataStore);

		return settings;
	}

}

// Export
export default Settings;

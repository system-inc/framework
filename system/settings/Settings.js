// Dependencies
import File from './../../system/file-system/File.js';
import DataStore from './../../system/data/DataStore.js';

// Class
class Settings {

	dataStore = null;
	defaults = null;

	constructor(defaultData, data, dataStore = new DataStore()) {
		// Set the data store
		this.dataStore = dataStore;
		//Console.standardLog('this.dataStore', this.dataStore);

		// Set the defaults
		this.setDefaults(defaultData);

		// Set the initial data for the data store
		this.dataStore.merge(data);
	}

	setDefaults(defaultData) {
		if(defaultData) {
			// Save the defaultData
			this.defaults = defaultData.clone();

			// Get the current data
			var data = this.dataStore.getData();
			//Console.log('data', data);

			// Set the data to the default data
			this.dataStore.setData(this.defaults);

			// Merge the current data on top of the defaults
			this.dataStore.merge(data);
		}
	}

	merge(data) {
		return this.dataStore.merge(data);
	}

	async mergeFromFile(datafilePath) {
		// Read the data from the file
		var data = await File.readAndDecodeJson(datafilePath);
		//Console.log('Settings from', datafilePath, 'to merge:', dataStore);

		return this.merge(data);
	}

	integrate(data) {
		return this.dataStore.integrate(data);
	}

	async integrateFromFile(datafilePath) {
		try {
			// Read the data from the file
			var data = await File.readAndDecodeJson(datafilePath);
			//Console.log('Settings from', datafilePath, 'to integrate:', dataStore);
			
			this.integrate(data);	
		}
		catch(error) {
			console.error('--- no file at '+datafilePath);
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

	static async constructFromFile(defaultData, datafilePath, dataStore) {
		//Console.log('datafilePath', datafilePath);

		// Read the data from the file
		var data = await File.readAndDecodeJson(datafilePath);
		console.log('data', data);

		//Console.log('dataStore', dataStore);

		// Create a new settings object with the data
		var settings = new Settings(defaultData, data, dataStore);

		return settings;
	}

}

// Export
export default Settings;

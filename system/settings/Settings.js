// Dependencies
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class Settings {

	datastore = null;
	defaults = null;

	constructor(defaults = {}, data = {}, datastore = new Datastore()) {
		// Set the data store
		this.datastore = datastore;
		//console.log('this.datastore', this.datastore);

		// Set the defaults
		this.setDefaults(defaults);

		// Set the initial data for the data store
		if(data) {
			this.merge(data);
		}
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
		var data = this.datastore.getData();
		//console.log('data', data);

		// Set the data to the default data
		this.datastore.setData(this.defaults);

		// Merge the current data on top of the defaults
		this.datastore.merge(data);

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

		return this.datastore.merge(dataToMerge);
	}

	async mergeFromFile(dataFilePath) {
		// Read the data from the file
		var data = await File.readAndDecodeJson(dataFilePath);
		//console.log('Settings from', dataFilePath, 'to merge:', data);

		return this.merge(data);
	}

	integrate(data) {
		return this.datastore.integrate(data);
	}

	async integrateFromFile(dataFilePath) {
		//app.log('integrateFromFile', dataFilePath);

		try {
			const { File } = await import('@framework/system/file-system/File.js');

			// Read the data from the file
			var data = await File.readAndDecodeJson(dataFilePath);
			//console.log('Settings from', dataFilePath, 'to integrate:', data);
			
			this.integrate(data);
			//console.log('Settings .integrateFromFile', this);
		}
		catch(error) {
			//console.error('No file at '+dataFilePath);
			//console.error(error);
		}
	}

	get(path) {
		return this.datastore.get(path);
	}

	set(path, value) {
		return this.datastore.set(path, value);
	}

	delete(path) {
		return this.datastore.delete(path);
	}

	static async constructFromFile(defaults, dataFilePath, datastore) {
		//console.log('dataFilePath', dataFilePath);
		const { File } = await import('@framework/system/file-system/File.js');

		// Read the data from the file
		var data = await File.readAndDecodeJson(dataFilePath);
		//console.log('data', data);

		//console.log('datastore', datastore);

		// Create a new settings object with the data
		var settings = new Settings(defaults, data, datastore);

		return settings;
	}

	static is = function(value) {
		return Class.isInstance(value, Settings);
	}

}

// Export
export { Settings };

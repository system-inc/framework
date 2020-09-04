// Dependencies
import { Datastore } from '@framework/system/datastore/Datastore.js';

// Class
class Settings {

	datastore = null;
	defaults = null;

	constructor(defaults = null, data = null, datastore = null) {
		// Create the datastore if one is not passed in
		if(datastore === null) {
			datastore = new Datastore();
		}

		// Set the data store
		this.datastore = datastore;
		//console.log('this.datastore', this.datastore);

		// Set the defaults
		if(defaults !== null) {
			this.setDefaults(defaults);
		}
		// If no defaults were provided, set the defaults to an empty object
		else {
			this.defaults = {};
		}
		
		// Set the initial data for the data store
		if(data !== null) {
			this.merge(data);
		}
	}

	setDefaults(defaults = null) {
		if(defaults !== null) {
			// Set the defaults to a clone of defaults
			// Make sure we never store references to outside objects
			this.defaults = defaults.clone();

			// Apply the defaults to the current data store
			this.applyDefaults();
		}		

		return this;
	}

	mergeDefaults(defaultsToMerge = null) {
		if(defaultsToMerge !== null) {
			// Make sure we never store references to outside objects
			defaultsToMerge = defaultsToMerge.clone();

			// Merge in the new defaults to the existing defaults
			this.defaults.merge(defaultsToMerge);

			// Apply the defaults to the current data store
			this.applyDefaults();
		}		

		return this;
	}

	applyDefaults() {
		// Clone to make sure we do not inherit references
		var defaults = this.defaults.clone();

		// Inherit adds new data but does not overwrite existing data (but it will replace null values)
		this.datastore.inherit(defaults);

		return this;
	}

	merge(settingsOrData = null) {
		if(settingsOrData !== null) {
			var dataToMerge = settingsOrData;

			// Handle if settingsOrData is an instance of Settings
			if(Settings.is(settingsOrData)) {
				dataToMerge = settingsOrData.getData();
			}

			// Make sure we never store outside references
			dataToMerge = dataToMerge.clone();

			this.datastore.merge(dataToMerge);
		}

		return this;
	}

	async mergeFromFile(dataFilePath) {
		// Read the data from the file
		var data = await File.readAndDecodeJson(dataFilePath);
		//console.log('Settings from', dataFilePath, 'to merge:', data);

		return this.merge(data);
	}

	integrate(settingsOrData) {
		if(settingsOrData !== null) {
			var dataToIntegrate = settingsOrData;

			// Handle if settingsOrData is an instance of Settings
			if(Settings.is(settingsOrData)) {
				dataToIntegrate = settingsOrData.getData();
			}

			// Make sure we never store outside references
			dataToIntegrate = dataToIntegrate.clone();

			this.datastore.integrate(dataToIntegrate);
		}

		return this;
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

	reset() {
		this.delete();
		this.applyDefaults();

		return this;
	}

	static is = function(value) {
		return Class.isInstance(value, Settings);
	}

	static async fromFile(defaults, dataFilePath, datastore) {
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

}

// Export
export { Settings };

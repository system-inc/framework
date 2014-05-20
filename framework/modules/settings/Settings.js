Settings = Class.extend({

	construct: function(settingsFilePath) {
		this.settings = this.loadSettingsFromFile(settingsFilePath);
		//console.log('Settings this.settings', this.settings.toString());
	},

	loadSettingsFromFile: function(settingsFilePath) {
		var settings = {};

		if(File.synchronous.exists(settingsFilePath)) {
			// Get the settings JSON
			var settingsJson = File.synchronous.read(settingsFilePath).toString();

			// Make sure we have JSON
			if(Json.is(settingsJson)) {
				settings = Json.decode(settingsJson);
			}
		}

		return settings;
	},

	get: function(selector) {
		var keys = selector.split('.');
		var value = null;
		var current = this.settings;

		// Search for they key they specified
		for(var i = 0; i < keys.length; i++) {
			// If the key exists assign it
			if(current[keys[i]]) {
				current = current[keys[i]];
			}
			// If the key does not exist, exit the loop
			else {
				current = null;
				break;
			}
		}

		// Set the value to return to be the last value found for the last key
		value = current;

		return value;
	},

});
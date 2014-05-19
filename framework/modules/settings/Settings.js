Settings = Class.extend({

	construct: function(settingsFilePath) {
		this.settings = this.loadSettingsFromFile(settingsFilePath);

		console.log('Settings this.settings', this.settings.toString());
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

});
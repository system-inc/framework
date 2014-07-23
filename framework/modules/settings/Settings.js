Settings = Class.extend({

	settings: {},

	construct: function() {
	},

	constructFromFile: function(path) {
		var settings = new Settings();
		settings.settings = File.synchronous.readJson(path);

		return settings;
	},

	constructFromObject: function(object) {
		var settings = new Settings();
		if(object) {
			settings.settings = object;	
		}
		
		return settings;
	},

	default: function(defaultSettings) {
		this.settings = defaultSettings.merge(this.settings);
	},

	mergeSettingsFromFile: function(path) {
		var settings = File.synchronous.readJson(path);
		//Console.out('Settings from', path, 'to merge:', settings);
		this.settings.merge(settings);
	},

	isEmpty: function() {
		return this.settings.isEmpty();
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

	set: function(selector, value) {
		var keys = selector.split('.');
		var current = this.settings;

		// Search for they key they specified
		for(var i = 0; i < keys.length; i++) {
			// If the key isn't set and it isn't the last, create an object
			if(!current[keys[i]] && i != keys.length - 1) {
				current[keys[i]] = {};
			}

			// If the key is the last key, set the value
			if(i == keys.length - 1) {
				current[keys[i]] = value;
			}
			// If the key is not the last key, set current to the most recent key and loop again
			else {
				current = current[keys[i]];
			}
		}

		return this;
	},

});

// Static methods
Settings.constructFromFile = Settings.prototype.constructFromFile;
Settings.constructFromObject = Settings.prototype.constructFromObject;
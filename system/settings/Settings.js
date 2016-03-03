// Dependencies
var File = Framework.require('system/file-system/File.js');

// Class
var Settings = Class.extend({

	object: null,
	defaults: null,

	construct: function(object, defaults) {
		if(object && Object.is(object)) {
			this.object = object;
		}
		else {
			this.object = {};
		}

		if(defaults) {
			this.setDefaults(defaults);
		}
	},

	setDefaults: function(defaults) {
		this.defaults = defaults.clone();

		this.object = defaults.merge(this.object);

		return this;
	},

	mergeSettingsFromFile: function(filePath) {
		var object = File.synchronous.read.json(filePath);
		//Console.log('Settings from', filePath, 'to merge:', object);

		this.object.merge(object);

		return this;
	},

	integrateSettingsFromFile: function(filePath) {
		var object = File.synchronous.read.json(filePath);
		//Console.log('Settings from', filePath, 'to integrate:', object);
		
		this.object.integrate(object);

		return this;
	},

	isEmpty: function() {
		return this.object.isEmpty();
	},

	get: function(path) {
		return this.object.getValueByPath(path);
	},

	set: function(path, value) {
		return this.object.setValueByPath(path, value);
	},

});

// Static methods

Settings.constructFromFile = function(filePath, defaults) {
	var object = File.synchronous.read.json(filePath);

	var object = new Settings(object, defaults);

	return object;
};

// Export
module.exports = Settings;
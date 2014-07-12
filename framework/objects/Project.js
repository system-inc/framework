ProjectSingleton = Class.extend({

	path: null,
	settings: null,

	construct: function(path) {
		// Set the path
		this.path = path;

		// Load the settings
		Log.log('Loading project settings...');
		this.settings = new Settings(this.path+'settings/settings.json');

		// Attach to Framework
		Framework.attachProject(this);
	},

	load: function() {
	},

});

// Static methods
ProjectSingleton.load = ProjectSingleton.prototype.load;
Project = Class.extend({

	path: null,
	settings: null,

	construct: function() {
		// Load the settings
		console.log('Loading project settings...');
		this.settings = new Settings(this.path+'settings/settings.json');

		// Attach to Framework
		Framework.attachProject(this);
	},

	load: function() {
	},

});

// Static methods
Project.load = Project.prototype.load;
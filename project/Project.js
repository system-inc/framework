// Framework
require('./../framework/Framework.js');

ProjectSingleton = Class.extend({

	construct: function() {
		this.path = __dirname+'/';
		this.settings = new Settings(this.path+'settings/settings.json');
		Framework.createWebServer();
	},

});

Project = new ProjectSingleton();
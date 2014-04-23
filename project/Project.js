// Framework
require('./../framework/Framework.js');

ProjectSingleton = Class.extend({

	construct: function() {
		this.path = __dirname+'/';
		Framework.createWebServer();
	},

});

Project = new ProjectSingleton();
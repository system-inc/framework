// Framework
require('./../framework/Framework.js');

Project = Class.extend({

	construct: function() {
		Framework.createWebServer();
	},

});

var project = new Project();
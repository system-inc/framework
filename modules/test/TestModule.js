require('./Assert');
require('./Test');
require('./Proctor');

TestModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});
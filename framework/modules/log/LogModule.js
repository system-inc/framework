require('./Log');

LogModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.super(settings);
		this.version = new Version('1.0');
	},
	
});
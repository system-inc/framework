require('./OperatingSystem');

OperatingSystemModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function() {
		this.parent();
	},
	
});
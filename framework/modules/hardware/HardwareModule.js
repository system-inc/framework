require('./Device');
require('./Hardware');

HardwareModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.super(settings);
		this.version = new Version('1.0');
	},
	
});

// Initialize the module
HardwareModule = new HardwareModuleClass();
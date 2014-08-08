require('./Device');
require('./Hardware');

HardwareModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});

// Initialize the module
HardwareModule = new HardwareModuleClass();
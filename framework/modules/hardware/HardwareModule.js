require('./Device');
require('./Hardware');

HardwareModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function() {
	},
	
});

// Initialize the module
HardwareModule = new HardwareModuleClass();
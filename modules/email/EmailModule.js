require('./EmailAddress');
require('./Email');

EmailModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});

// Initialize the module
EmailModule = new EmailModuleClass();
require('./EmailAddress');
require('./Email');

EmailModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});

// Initialize the module
EmailModule = new EmailModuleClass();
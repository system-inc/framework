require('./XmlDocument');
require('./XmlElement');
require('./XmlElements');

XmlModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});

// Initialize the module
XmlModule = new XmlModuleClass();
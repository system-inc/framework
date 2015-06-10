require('./HtmlElement');
require('./Html');
require('./HtmlDocument');


HtmlModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});

// Initialize the module
HtmlModule = new HtmlModuleClass();
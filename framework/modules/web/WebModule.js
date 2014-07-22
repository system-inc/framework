require('./Browser');
require('./Url');
require('./WebRequest');
require('./Web');

WebModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.super(settings);
		this.version = new Version('1.0');
	},
	
});
require('./Browser');
require('./Cookie');
require('./Cookies');
require('./Header');
require('./Headers');
require('./Url');
require('./WebRequest');
require('./Web');

WebModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});
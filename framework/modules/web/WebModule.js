require('./Browser');
require('./Url');
require('./WebRequest');
require('./Web');

WebModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function() {
		this.parent();
	},
	
});
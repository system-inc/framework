require('./Browser');
require('./Cookie');
require('./Cookies');
require('./Header');
require('./Headers');
require('./LocalStorage');
require('./Url');
require('./WebRequest');
require('./Web');

require('./interface/KeyboardShortcut.js');
require('./interface/KeyboardShortcuts.js');

WebModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});
require('./Assert');
require('./Test');
require('./TestGroup');
require('./TestReporter');

TestModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});
require('./Assert');
require('./Test');
require('./Proctor');
require('./test-reporter/TestReporter');
require('./test-reporter/StandardTestReporter');

TestModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});
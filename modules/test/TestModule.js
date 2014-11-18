require('./Assert');
require('./Test');
require('./Proctor');
require('./Fixture');
require('./test-reporter/TestReporter');
require('./test-reporter/StandardTestReporter');
require('./test-reporter/ConciseTestReporter');
require('./test-reporter/DotTestReporter');

TestModuleClass = Module.extend({

	version: null,

	construct: function(settings) {
		this.version = new Version('1.0');
		this.super(settings);
	},
	
});
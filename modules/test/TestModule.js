require('./Assert');
require('./Test');
require('./Proctor');
require('./Fixture');
require('./test-reporter/TestReporter');
require('./test-reporter/StandardTestReporter');
require('./test-reporter/ConciseTestReporter');
require('./test-reporter/DotTestReporter');

TestModuleClass = Module.extend({

	version: new Version('1.0'),

	construct: function(settings) {
		this.super(settings);
	},
	
});
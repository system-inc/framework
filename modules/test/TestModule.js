TestModule = Module.extend({

	version: new Version('0.1.0'),

	dependencies: [
		'Assert',
		'Test',
		'Proctor',
		'Fixture',
		'test-reporter/TestReporter',
		'test-reporter/StandardTestReporter',
		'test-reporter/ConciseTestReporter',
		'test-reporter/DotTestReporter',
	],
	
});
TestModule = Module.extend({

	version: new Version('0.1.0'),

	// Needs every module we want to test (except for core modules which are already loaded)
	needs: [
		'Archive',
		'Cryptography',
		'Data',
		'Database',
		'Email',
		'Ffmpeg',
		'Geolocation',
		'Hardware',
		'Html',
		'Network',
		'OperatingSystem',
		'Server',
		'Web',
		'WebServer',
		'Xml',
	],

	uses: [
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
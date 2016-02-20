WebModule = Module.extend({

	version: new Version('1.0'),

	needs: [
		'Data',
		'Geolocation',
		'Html',
		'Network',
		'OperatingSystem',
	],

	uses: [
		'Browser',
		'Cookie',
		'Cookies',
		'Header',
		'Headers',
		'LocalStorage',
		'Url',
		'WebRequest',
		'Web',
		'WebApi',
		'controllers/WebController',
		'elements/WebElement',
		'headers/RangeHeader.js',
		'interface/KeyboardShortcut',
		'interface/KeyboardShortcuts',
	],
	
});
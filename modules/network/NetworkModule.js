NetworkModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'IpAddress',
		'IpV4Address',
		'IpV6Address',
		'Network',
	],
	
});
XmlModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'XmlNode',
		'XmlElement',
		'XmlDocument',
	],
	
});
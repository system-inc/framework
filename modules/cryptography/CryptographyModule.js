CryptographyModule = Module.extend({

	version: new Version('0.1.0'),

	uses: [
		'Cryptography',
	],

	initialize: function(settings) {
		this.super.apply(this, arguments);
		//Console.out('WebServerModule initialize', this.settings);
	},
	
});
HtmlModule = Module.extend({

	version: new Version('0.1.0'),

	needs: [
		'Xml',
	],

	uses: [
		'HtmlElement',
		'Html',
		'HtmlDocument',
	],
	
});
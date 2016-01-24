HtmlModule = Module.extend({

	version: new Version('0.1.0'),

	needs: [
		'Xml',
	],

	uses: [
		'HtmlNode',
		'HtmlElement',
		'Html',
		'HtmlDocument',
	],
	
});
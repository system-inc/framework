WebComponent = Class.extend({

	element: null,

	settings: null,

	construct: function(settings) {
		this.settings = new Settings(settings);

		// The default tag for a web component is a div
		this.settings.default({
			tag: 'div',
		});

		// Every web component must have an HtmlElement
		this.element = new HtmlElement(this.settings.get('tag'));
	},

	toString: function() {
		return this.element.toString();
	},

});
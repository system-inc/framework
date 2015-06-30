WebComponent = Class.extend({

	// Every web component must have an HtmlElement
	element: null,

	// Settings for the web component
	settings: null,

	construct: function(settings) {
		this.settings = Settings.default({
			// The default tag for a web component is a div
			tag: 'div',
		}, settings);

		// Initialize the component when the DOM document is ready
		HtmlDocument.on('ready', function() {
			this.initialize();
		}.bind(this));
	},

	initialize: function() {
		// Every web component must have an HtmlElement
		this.element = new HtmlElement(this.settings.get('tag'));
	},

	toString: function() {
		return this.element.toString();
	},

});

// Static methods
WebComponent.load = function(webComponentName) {
	var webComponentPath = Project.directory+'views'+Node.Path.separator+'web-components'+Node.Path.separator+webComponentName+'WebComponent.js';
	//console.log(webComponentPath);

	return Framework.require(webComponentPath);
}
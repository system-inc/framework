// Dependencies
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var Settings = Framework.require('system/settings/Settings.js');

// Class
var View = HtmlElement.extend({

	// All web elements use a div tag unless otherwise specified
	tag: 'div',

	// Settings for the View
	settings: new Settings(),

	viewContainer: null,

	construct: function(options, settings) {
		this.settings.merge(settings);

		// Every View is an HtmlElement
		this.super(this.tag, options);

		// Set the viewContainer alias
		this.viewContainer = this.htmlDocument;

		// Emit htmlNode.mountedToDom events as view.initialized
		this.on('htmlNode.mountedToDom', function(event) {
			// May need to set the alias again here
			this.viewContainer = this.htmlDocument;

			this.emit('view.initialized', event);
		}.bind(this));
	},

});

// Export
module.exports = View;
// Dependencies
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var Settings = Framework.require('system/settings/Settings.js');

// Class
var View = HtmlElement.extend({

	// All web elements use a div tag unless otherwise specified
	tag: 'div',

	// Settings for the View
	settings: new Settings(),

	construct: function(settings) {
		this.settings.merge(settings);

		// Every View is an HtmlElement
		this.super();
	},

});

// Export
module.exports = View;
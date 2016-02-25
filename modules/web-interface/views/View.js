// Dependencies
var HtmlElement = Framework.require('modules/html/HtmlElement.js');
var Settings = Framework.require('modules/settings/Settings.js');

// Class
var View = HtmlElement.extend({

	// All web elements use a div tag unless otherwise specified
	tag: 'div',

	// Settings for the View
	settings: null,

	construct: function(settings) {
		this.settings = new Settings(settings, {
		});

		// Every View is an HtmlElement
		this.super();
	},

	onMountedToDom: function() {
		// Register event listeners
		this.listen();
	},

	// Abstract method
	listen: function() {
		// By default we listen to nothing
	},

});

// Export
module.exports = View;
// Dependencies
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');

// Class
var ViewContainer = HtmlDocument.extend({

	construct: function() {
		this.super.apply(this, arguments);

		this.on('htmlDocument.mountedToDom', function(event) {
			this.initialize();
		}.bind(this));
	},

	initialize: function() {
	},

});

// Export
module.exports = ViewContainer;
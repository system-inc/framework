// Dependencies
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');

// Class
var Application = Class.extend({

	currentWindow: {},

	// Applications can have multiple ViewManagers/windows which are (htmlDocuments?)
	viewManagers: {},

	construct: function() {
		super();

		// Emit htmlDocument.mountedToDom events as viewContainer.initialized
		this.on('htmlDocument.mountedToDom', function(event) {
			this.emit('viewContainer.initialized', event);
		}.bind(this));

		// Emit htmlDocument.resize events as viewContainer.resize
		this.on('htmlDocument.resize', function(event) {
			this.emit('viewContainer.resize', event);
		}.bind(this));
	},

	initialize: function() {
		this.mountToDom();
	},

});

// Export
module.exports = Application;
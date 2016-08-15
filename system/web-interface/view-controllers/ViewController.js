// Dependencies
var Settings = Framework.require('system/settings/Settings.js');
var ViewContainer = Framework.require('system/web-interface/view-containers/ViewContainer.js');

// Class
var ViewController = Class.extend({

	viewContainer: null,
	view: null,
	subviews: {},

	settings: new Settings(),

	construct: function(settings) {
		this.settings.merge(settings);

		this.createViewContainer();

		this.createView();

		this.createSubviews();

		this.initializeViewContainer();
	},

	createViewContainer: function() {
		this.viewContainer = new ViewContainer();
	},

	createView: function() {
		this.view = this.viewContainer.body;
	},

	createSubviews: function() {
	},

	initializeViewContainer: function() {
		this.viewContainer.on('viewContainer.initialized', function() {
			this.initialize();
		}.bind(this));

		this.viewContainer.initialize();
	},

	initialize: function() {
	},

});

// Export
module.exports = ViewController;
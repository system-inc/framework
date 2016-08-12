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

		this.mount();
	},

	createViewContainer: function() {
		this.viewContainer = new ViewContainer();
	},

	createView: function() {
		this.view = this.viewContainer.body;
	},

	createSubviews: function() {
	},

	mount: function() {
		this.viewContainer.mountToDom();
	},

});

// Export
module.exports = ViewController;
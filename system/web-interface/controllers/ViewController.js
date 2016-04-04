// Class
var ViewController = Class.extend({

	root: null,
	parent: null,
	children: [],

	htmlDocument: null,

	view: null,

	// Settings for the ViewController
	settings: null,

	construct: function(settings) {
		this.settings = new Settings(settings, {
		});
	},

	prepend: function(webController) {
		this.children.prepend(webController);
	},

	append: function(webController) {
		this.children.append(webController);
	},

});

// Export
module.exports = ViewController;
// Class
var ViewController = Class.extend({

	root: null,
	parent: null,
	children: [],

	element: null,

	construct: function() {
		
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
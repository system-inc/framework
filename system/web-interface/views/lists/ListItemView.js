// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var ListItemView = View.extend({

	tag: 'li',

	attributes: {
		class: 'item',
	},

});

// Export
module.exports = ListItemView;
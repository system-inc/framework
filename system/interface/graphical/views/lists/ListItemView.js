// Dependencies
var View = Framework.require('system/interface/graphical/views/View.js');

// Class
var ListItemView = View.extend({

	tag: 'li',

	attributes: {
		class: 'item',
	},

});

// Export
module.exports = ListItemView;
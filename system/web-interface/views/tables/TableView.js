// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var TableView = View.extend({

	tag: 'table',

	attributes: {
		class: 'table',
	},

});

// Export
module.exports = TableView;
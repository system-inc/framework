// Dependencies
var ListView = Framework.require('system/web-interface/views/lists/ListView.js');

// Class
var OrderedListView = ListView.extend({

	tag: 'ol',

	attributes: {
		class: 'list ordered',
	},

});

// Export
module.exports = OrderedListView;
// Dependencies
var ListView = Framework.require('framework/system/interface/graphical/views/lists/ListView.js');

// Class
var OrderedListView = ListView.extend({

	tag: 'ol',

	attributes: {
		class: 'list ordered',
	},

});

// Export
module.exports = OrderedListView;
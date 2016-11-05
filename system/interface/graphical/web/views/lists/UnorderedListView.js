// Dependencies
var ListView = Framework.require('system/interface/graphical/web/views/lists/ListView.js');

// Class
var UnorderedListView = ListView.extend({

	tag: 'ul',

	attributes: {
		class: 'list unordered',
	},

});

// Export
module.exports = UnorderedListView;
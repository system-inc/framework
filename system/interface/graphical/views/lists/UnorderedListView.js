// Dependencies
var ListView = Framework.require('framework/system/interface/graphical/views/lists/ListView.js');

// Class
var UnorderedListView = ListView.extend({

	tag: 'ul',

	attributes: {
		class: 'list unordered',
	},

});

// Export
module.exports = UnorderedListView;
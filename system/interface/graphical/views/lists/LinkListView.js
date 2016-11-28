// Dependencies
var ListView = Framework.require('framework/system/interface/graphical/views/lists/ListView.js');
var LinkListItemView = Framework.require('framework/system/interface/graphical/views/lists/LinkListItemView.js');

// Class
var LinkListView = ListView.extend({

	tag: 'ul',

	addItem: function(linkContent, linkUrl, linkListItemViewSettings) {
		var linkListItemView = new LinkListItemView(linkContent, linkUrl, linkListItemViewSettings);
		this.append(linkListItemView);

		return linkListItemView;
	},

});

// Export
module.exports = LinkListView;
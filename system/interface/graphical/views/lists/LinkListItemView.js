// Dependencies
var ListItemView = Framework.require('framework/system/interface/graphical/views/lists/ListItemView.js');
var LinkView = Framework.require('framework/system/interface/graphical/views/links/LinkView.js');

// Class
var LinkListItemView = ListItemView.extend({

	construct: function(linkContent, linkUrl, linkViewSettings, listItemViewSettings) {
		super(listItemViewSettings);

		var linkView = new LinkView(linkContent, linkUrl, linkViewSettings);
		this.append(linkView);
	},

});

// Export
module.exports = LinkListItemView;
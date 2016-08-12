// Dependencies
var ListItemView = Framework.require('system/web-interface/views/lists/ListItemView.js');
var LinkView = Framework.require('system/web-interface/views/links/LinkView.js');

// Class
var LinkListItemView = ListItemView.extend({

	construct: function(linkContent, linkUrl, linkViewSettings, listItemViewSettings) {
		var linkView = new LinkView(linkContent, linkUrl, linkViewSettings);
		this.append(linkView);

		this.super.call(this, listItemViewSettings);
	},

});

// Export
module.exports = LinkListItemView;
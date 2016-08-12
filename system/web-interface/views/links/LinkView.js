// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var LinkView = View.extend({

	tag: 'a',

	attributes: {
		class: 'link',
	},

	construct: function(linkContent, linkUrl, viewSettings) {
		this.setContent(linkContent);
		this.setAttribute('href', linkUrl);

		this.super.call(this, viewSettings);
	},

});

// Export
module.exports = LinkView;
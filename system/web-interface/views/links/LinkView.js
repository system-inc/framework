// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var LinkView = View.extend({

	tag: 'a',

	attributes: {
		class: 'link',
	},

	construct: function(settings) {
		if(settings && settings.url) {
			this.setAttribute('href', settings.url);
		}
		
		this.super.apply(this, arguments);
	},

});

// Export
module.exports = LinkView;
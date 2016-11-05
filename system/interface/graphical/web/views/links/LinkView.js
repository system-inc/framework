// Dependencies
var View = Framework.require('system/interface/graphical/web/views/View.js');

// Class
var LinkView = View.extend({

	attributes: {
		class: 'link',
	},

	construct: function(settings, tag = 'a') {
		super(null, settings, tag);

		if(settings && settings.url) {
			this.setAttribute('href', settings.url);
		}
	},

});

// Export
module.exports = LinkView;
// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var ImageView = View.extend({

	tag: 'img',

	attributes: {
		class: 'image',
	},

	construct: function(url, alternateText, settings) {
		this.super.call(this, settings);

		this.setAttribute('src', url);

		if(alternateText) {
			this.setAttribute('alt', alternateText);	
		}
	},

});

// Export
module.exports = ImageView;
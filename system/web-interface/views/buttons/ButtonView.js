// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var Html = Framework.require('system/html/Html.js');

// Class
var ButtonView = View.extend({

	tag: 'a',

	attributes: {
		class: 'button',
	},

	construct: function(content, settings) {
		this.super.call(this, settings);
		this.settings.setDefaults({

		});

		this.append(content);
	},

});

// Export
module.exports = ButtonView;
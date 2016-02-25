// Dependencies
var View = Framework.require('modules/web-interface/views/View.js');

// Class
var NotificationView = View.extend({

	attributes: {
		class: 'notification',
		style: {
			display: 'none',
		},
	},

	show: function(content, options) {
		this.setContent(content);

		if(options && options.duration) {
			Function.delay(options.duration, function() {
				this.hide();
			}.bind(this));
		}
		
		this.super();
	},

});

// Export
module.exports = NotificationView;
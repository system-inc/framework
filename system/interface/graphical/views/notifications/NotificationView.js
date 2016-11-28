// Dependencies
var View = Framework.require('framework/system/interface/graphical/views/View.js');

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

		super.show();
	},

});

// Export
module.exports = NotificationView;
NotificationWebComponent = WebComponent.extend({

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
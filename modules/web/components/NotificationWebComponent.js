NotificationWebComponent = WebComponent.extend({

	attributes: {
		class: 'notification',
		style: {
			display: 'none',
		},
	},

	show: function(text) {
		this.setContent(text);
		
		this.super();
	},

});
NotificationWebComponent = WebComponent.extend({

	attributes: {
		class: 'notification',
		style: {
			display: 'none',
		},
	},

	// What is a notification?
	// appears anywhere in the UI to tell the user something
	// may disapear over a period of time
	// may require the user to acknowledge it to close it
	// may have an x to dismiss

	//construct: function(settings) {
	//	this.settings = Settings.default({

	//	}, settings);



	//	this.super();
	//},

	show: function(content) {
		this.setContent(content);
		
		this.super();
	},

});
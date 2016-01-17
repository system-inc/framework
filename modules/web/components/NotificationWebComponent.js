NotificationWebComponent = WebComponent.extend({

	construct: function() {
		this.super({
			'id': 'notification',
		});
	},

	show: function(text) {
		this.element.setContent(text);
		this.element.show();
	},

	hide: function() {
		this.element.hide();
	},

});
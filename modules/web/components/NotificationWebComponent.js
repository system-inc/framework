NotificationWebComponent = WebComponent.extend({

	show: function(text) {
		this.element.setContent(text);
		this.element.show();
	},

	hide: function() {
		this.element.hide();
	},

	initialize: function() {
		this.element = Html.div({
			'id': 'notification',
		});
	},

});
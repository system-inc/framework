WebComponent.load('TextInput');

TextAreaWebComponent = TextInputWebComponent.extend({

	initialize: function() {
		this.element = Html.textarea();
	},

});
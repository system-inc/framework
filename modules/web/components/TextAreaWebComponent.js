WebComponent.load('TextInput');

TextAreaWebComponent = TextInputWebComponent.extend({

	construct: function() {
		this.super({
			elementTag: 'textarea',
		});
	},

});
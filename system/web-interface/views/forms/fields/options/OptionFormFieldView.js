// Dependencies
var FormFieldView = Framework.require('system/web-interface/views/forms/FormFieldView.js');

// Class
var OptionFormFieldView = FormFieldView.extend({

	attributes: {
		class: 'field option',
	},

	textFormControlView: null,

	construct: function(identifier, settings) {
		this.super.apply(this, arguments);

		if(this.settings.get('enterSubmits')) {
			this.textFormControlView.on('keyboard.key.enter.down', function(event) {
				event.preventDefault();
				this.emit('form.submit');
			}.bind(this));
		}
	},

	focus: function() {
		return this.textFormControlView.focus();
	},

});

// Export
module.exports = OptionFormFieldView;
// Dependencies
var FormFieldView = Framework.require('system/web-interface/views/forms/FormFieldView.js');

// Class
var CheckboxInputFormFieldView = FormFieldView.extend({

	attributes: {
		class: 'field checkboxInput',
	},

	textInputView: null,

	construct: function(identifier, settings) {
		this.super.apply(this, arguments);

		this.textInputView = new TextInputView();
		this.append(this.textInputView);

		if(this.settings.get('enterSubmits')) {
			this.textInputView.on('keyboard.key.enter.down', function(event) {
				event.preventDefault();
				this.parent.submit(); // this assumes this.parent is a FormView; alternatively, we could emit a special event (e.g., 'form.submit') and have FormView listen for that event and submit the form when the event propagates up to it
			}.bind(this));
		}
	},

	getData: function() {
		return this.textInputView.getValue();
	},

	focus: function() {
		return this.textInputView.focus();
	},

	clear: function() {
		return this.textInputView.clear();
	},

});

// Export
module.exports = CheckboxInputFormFieldView;
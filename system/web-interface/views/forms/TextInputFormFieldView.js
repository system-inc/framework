// Dependencies
var FormFieldView = Framework.require('system/web-interface/views/forms/FormFieldView.js');
var TextInputView = Framework.require('system/web-interface/views/TextInputView.js');

// Class
var TextInputFormFieldView = FormFieldView.extend({

	attributes: {
		class: 'field textInput',
	},

	textInputView: null,

	construct: function(identifier, settings) {
		this.super.apply(this, arguments);

		this.textInputView = new TextInputView();
		this.append(this.textInputView);

		if(this.settings.get('enterSubmits')) {
			// TODO: Do this
			//this.textInputView.on('keyboard.key.enter.down', function(event) {
			//	event.preventDefault();
			//	this.parent.submit(); // this assumes this.parent is a FormView; alternatively, we could emit a special event (e.g., 'form.submit') and have FormView listen for that event and submit the form when the event propagates up to it
			//}.bind(this));

			// Not this
			this.textInputView.on('keydown', function(event) {
				if(event.data.which == 13) {
					event.data.preventDefault();
					this.parent.submit()
				}
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
		this.textInputView.setValue('');
	},

});

// Export
module.exports = TextInputFormFieldView;
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
			console.log('need to make enter submit');
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
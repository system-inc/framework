// Dependencies
var TextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/TextFormFieldView.js');
var EmailSingleLineTextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/single-line/EmailSingleLineTextFormControlView.js');

// Class
var EmailSingleLineTextFormFieldView = TextFormFieldView.extend({

	attributes: {
		class: 'field text singleLine email',
	},

	construct: function(identifier, settings) {
		// Create the form control
		this.textFormControlView = new EmailSingleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);

		this.super.apply(this, arguments);
	},

});

// Export
module.exports = EmailSingleLineTextFormFieldView;
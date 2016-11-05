// Dependencies
var TextFormFieldView = Framework.require('system/interface/graphical/web/views/forms/fields/text/TextFormFieldView.js');
var EmailSingleLineTextFormControlView = Framework.require('system/interface/graphical/web/views/forms/controls/text/single-line/EmailSingleLineTextFormControlView.js');

// Class
var EmailSingleLineTextFormFieldView = TextFormFieldView.extend({

	attributes: {
		class: 'field text singleLine email',
	},

	construct: function(identifier, settings) {
		super(...arguments);

		// Create the form control
		this.textFormControlView = new EmailSingleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);
	},

});

// Export
module.exports = EmailSingleLineTextFormFieldView;
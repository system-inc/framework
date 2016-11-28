// Dependencies
var TextFormFieldView = Framework.require('framework/system/interface/graphical/views/forms/fields/text/TextFormFieldView.js');
var PasswordSingleLineTextFormControlView = Framework.require('framework/system/interface/graphical/views/forms/controls/text/single-line/PasswordSingleLineTextFormControlView.js');

// Class
var PasswordSingleLineTextFormFieldView = TextFormFieldView.extend({

	attributes: {
		class: 'field text singleLine password',
	},

	construct: function(identifier, settings) {
		super(...arguments);

		// Create the form control
		this.textFormControlView = new PasswordSingleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);
	},

});

// Export
module.exports = PasswordSingleLineTextFormFieldView;
// Dependencies
var TextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/TextFormFieldView.js');
var SingleLineTextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/single-line/SingleLineTextFormControlView.js');

// Class
var SingleLineTextFormFieldView = TextFormFieldView.extend({

	attributes: {
		class: 'field text singleLine',
	},

	construct: function(identifier, settings) {
		// Create the form control, SingleLineTextFormControlView
		this.textFormControlView = new SingleLineTextFormControlView();

		// Call super after setting this.textFormControlView
		this.super.apply(this, arguments);

		// Append the form control
		this.append(this.textFormControlView);
	},

});

// Export
module.exports = SingleLineTextFormFieldView;
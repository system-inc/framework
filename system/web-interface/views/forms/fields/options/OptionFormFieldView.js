// Dependencies
var FormFieldView = Framework.require('system/web-interface/views/forms/fields/FormFieldView.js');
var OptionFormControlView = Framework.require('system/web-interface/views/forms/controls/options/OptionFormControlView.js');

// Class
var OptionFormFieldView = FormFieldView.extend({

	attributes: {
		class: 'field option',
	},

	construct: function(identifier, settings) {
		// TOOD: Broken
		// Call super after setting this.formControlView
		super(...arguments);

		// Create the form control, OptionFormControlView
		this.formControlView = new OptionFormControlView();
		
		// Append the form control
		this.append(this.formControlView);
	},

});

// Export
module.exports = OptionFormFieldView;
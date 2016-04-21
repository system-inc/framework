// Dependencies
var TextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/TextFormFieldView.js');
var MultipleLineTextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/multiple-line/MultipleLineTextFormControlView.js');

// Class
var MultipleLineTextFormFieldView = TextFormFieldView.extend({

	attributes: {
		class: 'field text multipleLine',
	},

	construct: function(identifier, settings) {
		// Create the form control
		this.textFormControlView = new MultipleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);

		this.super.apply(this, arguments);
	},

});

// Export
module.exports = MultipleLineTextFormFieldView;
// Dependencies
var TextFormFieldView = Framework.require('system/interface/graphical/web/views/forms/fields/text/TextFormFieldView.js');
var MultipleLineTextFormControlView = Framework.require('system/interface/graphical/web/views/forms/controls/text/multiple-line/MultipleLineTextFormControlView.js');

// Class
var MultipleLineTextFormFieldView = TextFormFieldView.extend({

	attributes: {
		class: 'field text multipleLine',
	},

	construct: function(identifier, settings) {
		super(...arguments);

		// Create the form control
		this.textFormControlView = new MultipleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);
	},

});

// Export
module.exports = MultipleLineTextFormFieldView;
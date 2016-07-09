// Dependencies
var FormFieldView = Framework.require('system/web-interface/views/forms/fields/FormFieldView.js');

// Class
var TextFormFieldView = FormFieldView.extend({

	attributes: {
		class: 'field text',
	},

});

// Export
module.exports = TextFormFieldView;
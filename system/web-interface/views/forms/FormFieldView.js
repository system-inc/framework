// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var FormFieldView = View.extend({

	tag: 'div',

	attributes: {
		class: 'field',
	},

});

// Export
module.exports = FormFieldView;
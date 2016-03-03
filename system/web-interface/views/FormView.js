// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var FormView = View.extend({

	tag: 'form',

	attributes: {
		class: 'form',
		style: {
			display: 'none',
		},
	},

});

// Export
module.exports = FormView;
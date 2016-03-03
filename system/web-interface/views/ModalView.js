// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var Html = Framework.require('system/html/Html.js');

// Class
var ModalView = View.extend({

	modal: null,

	attributes: {
		class: 'modalContainer',
		style: {
			display: 'none',
		},
	},

	construct: function() {
		this.super();

		this.modal = Html.div({
			class: 'modal',
		});

		this.append(this.modal);
	},

});

// Export
module.exports = ModalView;
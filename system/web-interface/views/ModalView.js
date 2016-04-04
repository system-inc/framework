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

	construct: function(settings) {
		this.super.apply(this, arguments);
		this.settings.setDefaults({
			hideOnOutsideClick: true,
		});

		this.modal = Html.div({
			class: 'modal',
		});

		this.append(this.modal);

		if(this.settings.get('hideOnOutsideClick')) {
			this.enableHideOnOutsideClick();
		}
	},

	enableHideOnOutsideClick: function() {
		this.modal.on('click', function(event) {
			//Console.log('modal click');
			event.data.stopPropagation();
		}.bind(this));

		// Close on clicking outside of modal
		this.on('click', function(event) {
			//Console.log('modal container click');
			this.hide();
		}.bind(this));
	},

});

// Export
module.exports = ModalView;
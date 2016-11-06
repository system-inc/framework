// Dependencies
var View = Framework.require('system/interface/graphical/views/View.js');

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
		super(null, settings);

		this.settings.setDefaults({
			hideOnOutsideClick: true,
		});

		this.modal = new View({
			class: 'modal',
		});

		this.append(this.modal);

		if(this.settings.get('hideOnOutsideClick')) {
			this.enableHideOnOutsideClick();
		}
	},

	enableHideOnOutsideClick: function() {
		this.modal.on('input.press', function(event) {
			//app.log('modal click');
			event.stopPropagation();
		}.bind(this));

		// Close on clicking outside of modal
		this.on('input.press', function(event) {
			//app.log('modal container click');
			this.hide();
		}.bind(this));
	},

});

// Export
module.exports = ModalView;
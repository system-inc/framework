// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ModalView extends View {

	modal = null;

	attributes = {
		style: {
			display: 'none',
		},
	};

	constructor(settings) {
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
	}

	enableHideOnOutsideClick() {
		this.modal.on('input.press', function(event) {
			//app.log('modal click');
			event.stopPropagation();
		}.bind(this));

		// Close on clicking outside of modal
		this.on('input.press', function(event) {
			//app.log('modal container click');
			this.hide();
		}.bind(this));
	}

}

// Export
export default ModalView;

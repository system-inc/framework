// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

import { Settings } from '@framework/system/settings/Settings.js';

// Class
class ModalView extends View {

	modalView = null;

	settings = new Settings({
		hideOnOutsideClick: true,
	});

	constructor(settings) {
		super();

		this.settings.merge(settings);

		this.setStyle({
			display: 'none',
			position: 'absolute',
			zIndex: 3,
			background: 'rgba(0, 0, 0, .5)',
			border: '1px solid #CCC',
			position: 'fixed',
		    top: 0,
		    right: 0,
		    bottom: 0,
		    left: 0,
		    justifyContent: 'center',
		    alignItems: 'center',
		});

		this.modalView = this.append(new View());
		this.modalView.setStyle({
			background: '#FFF',
			border: '1px solid #CCC',
			overflow: 'scroll',
			//margin: '1rem', // Let the implementer set this instead of having it be global
		});

		if(this.settings.get('hideOnOutsideClick')) {
			//console.log('enableHideOnOutsideClick');
			this.enableHideOnOutsideClick();
		}
	}

	enableHideOnOutsideClick() {
		this.modalView.on('input.press', function(event) {
			//console.log('modal click');
			event.stopPropagation();
		}.bind(this));

		// Close on clicking outside of modal
		this.on('input.press', function(event) {
			//console.log('modal container click');
			this.hide();
		}.bind(this));
	}

}

// Export
export { ModalView };

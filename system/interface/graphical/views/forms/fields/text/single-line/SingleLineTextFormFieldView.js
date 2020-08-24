// Dependencies
import { TextFormFieldView } from '@framework/system/interface/graphical/views/forms/fields/text/TextFormFieldView.js';
import { SingleLineTextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/single-line/SingleLineTextFormControlView.js';

// Class
class SingleLineTextFormFieldView extends TextFormFieldView {

	constructor(formFieldIdentifier, settings) {
		super(...arguments);

		// Create the form control, SingleLineTextFormControlView
		this.formControlView = new SingleLineTextFormControlView();

		// Handle enterSubmits enabled
		if(this.settings.get('enterSubmits')) {
			//console.log('enterSubmits');

			this.formControlView.on('input.key.enter', function(event) {
				//console.info('enterSubmits input.key.enter', event);
				event.preventDefault(); // Do not let the form navigate on enter key
				//event.stop();
				this.parent.submit();
				//this.emit('form.submit', event);
				//console.info(this);
			}.bind(this));
		}
		// enterSubmits disabled
		else {
			//console.log('no enterSubmits');

			this.formControlView.on('input.key.enter', function(event) {
				//console.log('no enterSubmits input.key.enter', event);
				event.preventDefault(); // Do not let the form navigate on enter key
			}.bind(this));
		}

		// Append the form control
		this.append(this.formControlView);
	}

}

// Export
export { SingleLineTextFormFieldView };

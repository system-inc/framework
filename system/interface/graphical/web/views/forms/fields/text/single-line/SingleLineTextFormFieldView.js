// Dependencies
import TextFormFieldView from './../../../../../../../system/web-interface/views/forms/fields/text/TextFormFieldView.js';
import SingleLineTextFormControlView from './../../../../../../../system/web-interface/views/forms/controls/text/single-line/SingleLineTextFormControlView.js';

// Class
class SingleLineTextFormFieldView extends TextFormFieldView {

	attributes = {
		class: 'field text singleLine',
	};

	constructor(identifier, settings) {
		super(...arguments);

		// Create the form control, SingleLineTextFormControlView
		this.formControlView = new SingleLineTextFormControlView();

		// Handle enterSubmits
		if(this.settings.get('enterSubmits')) {
			this.formControlView.on('input.key.enter', function(event) {
				event.preventDefault();
				this.emit('form.submit');
			}.bind(this));
		}

		// Append the form control
		this.append(this.formControlView);
	}

}

// Export
export default SingleLineTextFormFieldView;

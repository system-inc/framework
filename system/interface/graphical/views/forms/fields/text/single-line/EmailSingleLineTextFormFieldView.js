// Dependencies
import { TextFormFieldView } from '@framework/system/interface/graphical/views/forms/fields/text/TextFormFieldView.js';
import { EmailSingleLineTextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/single-line/EmailSingleLineTextFormControlView.js';

// Class
class EmailSingleLineTextFormFieldView extends TextFormFieldView {

	constructor(identifier, settings) {
		super(...arguments);

		// Create the form control
		this.textFormControlView = new EmailSingleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);
	}

}

// Export
export { EmailSingleLineTextFormFieldView };

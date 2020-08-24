// Dependencies
import { TextFormFieldView } from '@framework/system/interface/graphical/views/forms/fields/text/TextFormFieldView.js';
import { PasswordSingleLineTextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/single-line/PasswordSingleLineTextFormControlView.js';

// Class
class PasswordSingleLineTextFormFieldView extends TextFormFieldView {

	constructor(identifier, settings) {
		super(...arguments);

		// Create the form control
		this.textFormControlView = new PasswordSingleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);
	}

}

// Export
export { PasswordSingleLineTextFormFieldView };

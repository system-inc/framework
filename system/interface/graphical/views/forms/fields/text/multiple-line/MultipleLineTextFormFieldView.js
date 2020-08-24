// Dependencies
import { TextFormFieldView } from '@framework/system/interface/graphical/views/forms/fields/text/TextFormFieldView.js';
import { MultipleLineTextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/multiple-line/MultipleLineTextFormControlView.js';

// Class
class MultipleLineTextFormFieldView extends TextFormFieldView {

	constructor(identifier, settings) {
		super(...arguments);

		// Create the form control
		this.textFormControlView = new MultipleLineTextFormControlView();

		// Append the form control
		this.append(this.textFormControlView);
	}

}

// Export
export { MultipleLineTextFormFieldView };

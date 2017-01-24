// Dependencies
import FormFieldView from 'framework/system/interface/graphical/views/forms/fields/FormFieldView.js';
import OptionFormControlView from 'framework/system/interface/graphical/views/forms/controls/options/OptionFormControlView.js';

// Class
class OptionFormFieldView extends FormFieldView {

	constructor(identifier, settings) {
		// TOOD: Broken
		// Call super after setting this.formControlView
		super(...arguments);

		// Create the form control, OptionFormControlView
		this.formControlView = new OptionFormControlView();
		
		// Append the form control
		this.append(this.formControlView);
	}

}

// Export
export default OptionFormFieldView;

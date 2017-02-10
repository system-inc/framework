// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import Settings from 'framework/system/settings/Settings.js';

// Class
class FormControlView extends View {

	settings = new Settings();

	value = null;
	originalValue = null;

	constructor(settings) {
		super(null, settings);

		this.on('form.control.change', function(event) {
            this.valueChangedOnDom();
        }.bind(this));

		this.originalValue = this.value;
	}

	getValue() {
		return this.value;
	}

	setValue(value) {
		this.value = this.domNode.value = value;

		return this.value;
	}

	clear() {
		return this.setValue(null);
	}

	reset() {
		return this.setValue(this.originalValue);
	}

	// Two-way data binding: if the user changes the value on the DOM, the FormControlView is updated to reflect the new value
	valueChangedOnDom() {
		//console.info('Value changed on DOM, updating FormControlView');
		console.error('need to update dom node');
		//this.value = this.domNode.value;

		return this.value;
	}

	static is(value) {
		return Class.isInstance(value, FormControlView);
	}

}

// Export
export default FormControlView;

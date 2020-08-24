// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { Settings } from '@framework/system/settings/Settings.js';

// Class
class FormControlView extends View {

	settings = new Settings();

	value = '';
	originalValue = '';

	constructor(settings) {
		super();

		this.settings.merge(settings);

		this.on('form.control.change', function(event) {
			//console.log('event', event);
            this.valueChangedOnDom(event.data);
        }.bind(this));

		this.originalValue = this.value;
	}

	getValue() {
		return this.adapter.getValue(...arguments);
	}

	setValue(value) {
		return this.adapter.setValue(...arguments);

		// TODO: DO I need this?
		if(value === null || value === undefined) {
			value = '';
		}

		this.value = value;

		if(this.adapter.adaptedView && this.adapter.adaptedView.domNode) {
			this.adapter.adaptedView.domNode.value = this.value;
		}

		return this.value;
	}

	clear() {
		return this.setValue(null);
	}

	reset() {
		return this.setValue(this.originalValue);
	}

	// Two-way data binding: if the user changes the value on the DOM, the FormControlView is updated to reflect the new value
	valueChangedOnDom(newValue) {
		//console.info('Value changed on DOM, updating FormControlView');
		this.value = newValue;

		return this.value;
	}

	static is(value) {
		return Class.isInstance(value, FormControlView);
	}

}

// Export
export { FormControlView };

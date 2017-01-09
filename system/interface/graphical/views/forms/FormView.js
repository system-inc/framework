// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import Settings from 'framework/system/settings/Settings.js';
import FormFieldView from 'framework/system/interface/graphical/views/forms/fields/FormFieldView.js';
import ButtonView from 'framework/system/interface/graphical/views/buttons/ButtonView.js';

// Class
class FormView extends View {

	settings = new Settings({
		submitButtonView: {
			enabled: true,
			content: 'Submit',
		},
	});

	constructor(settings) {
		super();

		this.settings.merge(settings);
		//console.info('this.settings', this.settings);

		// Create the button
		if(this.settings.get('submitButtonView.enabled')) {
			// Create the container
			var submitButtonContainerView = new View();

			var submitButtonView = new ButtonView(this.settings.get('submitButtonView.content'));
	        submitButtonView.on('input.press', function(event) {
	        	//console.log('submitButtonView input.press');
	        	this.submit();
	        }.bind(this));

	        // Add the button to the container
	        submitButtonContainerView.append(submitButtonView);

	        // Add the container to the view
	        this.append(submitButtonContainerView);
		}
	}

	addFormFieldView(formFieldView) {
		// Append the form field to the view
		this.prepend(formFieldView);

		return formFieldView;
	}

	getData() {
		var data = {};

		this.children.each(function(childIndex, child) {
			if(Class.isInstance(child, FormFieldView)) {
				Console.standardInfo('child', child);
				data[child.identifier] = child.getData();
			}
		}.bind(this));
		
		return data;
	}

	clear() {
		this.children.each(function(childIndex, child) {
			if(Class.isInstance(child, FormFieldView)) {
				child.clear();
			}
		}.bind(this));
	}

	getValidationErrors() {
		var validationErrors = [];

		this.children.each(function(childIndex, child) {
			if(Class.isInstance(child, FormFieldView)) {
				var childValidationErrors = child.getValidationErrors();
				if(childValidationErrors.length) {
					validationErrors.append(childValidationErrors);
				}
			}
		}.bind(this));

		return validationErrors;
	}

	submit() {
		var validationErrors = this.getValidationErrors();

		if(!validationErrors.length) {
			this.emit('form.submit', this.getData());
		}
		else {
			app.error('failed validation', validationErrors);
		}
	}

	focusOnFirstFormField() {
		var firstChild = this.children.first();
		
		if(firstChild) {
			firstChild.focus();
		}
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'form',
		};
	}

}

// Export
export default FormView;

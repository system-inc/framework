// Dependencies
import View from './../../../../../system/web-interface/views/View.js';
import Html from './../../../../../system/interface/graphical/web/html/Html.js';
import HtmlElement from './../../../../../system/interface/graphical/web/html/HtmlElement.js';
import FormControlView from './../../../../../system/web-interface/views/forms/controls/FormControlView.js';

// Class
class FormFieldView extends View {

	attributes = {
		class: 'field',
	};

	identifier = null;

	labelView = null;

	formControlView = null;

	constructor(identifier, settings) {
		// Call the View constructor
		super(...arguments);

		// Set default settings
		this.settings.setDefaults({
			label: null,
			validation: {
				required: false,
			},
		});

		// Set the identifier, this will tie data for the form to the identifier as a key
		this.identifier = identifier;

		// Each form control has a unique identifier
		if(this.formControlView) {
			this.formControlView.setAttribute('id', 'formControl-'+this.identifier+'-'+String.uniqueIdentifier());	
		}		
		
		// Conditionally add a label
		if(this.settings.get('label')) {
			this.addLabel();
		}
	}

	addLabel() {
		// Create the label
		this.labelView = Html.label({
			content: this.settings.get('label'),
		});

		if(this.formControlView) {
			var formControlViewId = this.formControlView.getAttribute('id');
			if(formControlViewId) {
				this.labelView.setAttribute('for', formControlViewId);
			}
		}

		// Append the label
		this.append(this.labelView);

		return this.labelView;
	}

	getValidationErrors() {
		var validationErrors = [];

		var validationSettings = this.settings.get('validation');
		
		// If the field is required
		if(validationSettings.required) {
			var data = this.getData();
			if(!data || data.trim() == '') {
				validationErrors.append({
					identifier: 'required',
					message: 'Required.',
				});
			}
		}

		return validationErrors;
	}

	getData() {
		var getDataRecursively = function(view) {
			var data = null;

			// Make sure we are working with a view and not an HtmlNode
			if(!View.is(view)) {
				return;
			}

			// If the view is a FormControlView
			if(FormControlView.is(view)) {
				data = view.getValue();
			}
			// Check the children to see if there are any FormControlViews
			else if(view.children.length) {
				view.children.each(function(childIndex, child) {
					data = getDataRecursively(child);

					if(data) {
						return false; // break
					}
				});
			}

			return data;
		};

		var data = getDataRecursively(this);

		return data;
	}

	clear() {
		var clearRecursively = function(view) {
			// If the view is a FormControlView, clear it
			if(FormControlView.is(view)) {
				view.clear();
			}
			else if(HtmlElement.is(view)) {
				// Recurse through all children
				view.children.each(function(childIndex, child) {
					clearRecursively(child);
				});
			}
		};

		clearRecursively(this);

		return this;
	}

	focus() {
		return this.formControlView.focus();
	}

}

// Export
export default FormFieldView;

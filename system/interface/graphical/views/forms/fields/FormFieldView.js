// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import Settings from 'framework/system/settings/Settings.js';
import FormControlView from 'framework/system/interface/graphical/views/forms/controls/FormControlView.js';
import FormLabelView from 'framework/system/interface/graphical/views/forms/labels/FormLabelView.js';

// Class
class FormFieldView extends View {

	settings = new Settings({
		label: null,
		validation: {
			required: false,
		},
	});

	formLabelView = null;

	formControlView = null;

	constructor(identifier, settings) {
		// Call the View constructor
		super();

		// Merge in the settings
		this.settings.merge(settings);

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
		this.formLabelView = new FormLabelView(this.settings.get('label'), this);

		if(this.formControlView) {
			var formControlViewId = this.formControlView.getAttribute('id');
			if(formControlViewId) {
				this.formLabelView.setAttribute('for', formControlViewId);
			}
		}

		// Append the label
		this.append(this.formLabelView);

		return this.formLabelView;
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

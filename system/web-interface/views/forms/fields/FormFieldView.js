// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var Html = Framework.require('system/html/Html.js');

// Class
var FormFieldView = View.extend({

	attributes: {
		class: 'field',
	},

	identifier: null,
	labelView: null,

	construct: function(identifier, settings) {
		// Call the View constructor
		this.super.call(this, settings);

		// Set default settings
		this.settings.setDefaults({
			label: null,
			validation: {
				required: false,
			},
		});

		// Set the identifier, this will tie data for the form to the identifier as a key
		this.identifier = identifier;
		
		// Conditionally add a label
		if(this.settings.get('label')) {
			this.addLabel();
		}
	},

	addLabel: function() {
		// Create the label
		this.labelView = Html.div({
			class: 'label',
			content: this.settings.get('label'),
		});

		// Append the label
		this.append(this.labelView);

		return this.labelView;
	},

	getValidationErrors: function() {
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
	},

	getData: function() {
		var data = {};

		var getDataRecursively = function(view) {
			// If the view is a FormControlView
			if(FormControlView.is(view)) {
				data[view.identifier] = view.getData();
			}
			// Check the children to see if there are any FormControlViews
			else if(view.children.length) {
				view.children.each(function(childIndex, child) {
					getDataRecursively(child);
				});
			}
		};

		getDataRecursively(this);

		return data;
	},

	clear: function() {
		var clearRecursively = function(view) {
			// If the view is a FormControlView, clear it
			if(FormControlView.is(view)) {
				view.clear();
			}

			// Recurse through all children
			view.children.each(function(childIndex, child) {
				clearRecursively(child);
			});
		};

		clearRecursively(this);

		return this;
	},

});

// Export
module.exports = FormFieldView;
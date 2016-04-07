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
					message: 'This field is required',
				});
			}
		}

		return validationErrors;
	},

	getData: function() {
		throw new Error('Classes extending FormFieldView must implement the getData() method.');
	},

	clear: function() {
		throw new Error('Classes extending FormFieldView must implement the clear() method.');
	},

});

// Export
module.exports = FormFieldView;
// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var Html = Framework.require('system/html/Html.js');
var FormFieldView = Framework.require('system/web-interface/views/forms/fields/FormFieldView.js');

// Class
var FormView = View.extend({

	tag: 'form',

	attributes: {
		class: 'form',
	},

	submitButton: null,

	construct: function(settings) {
		// Call View's constructor
		this.super.apply(this, arguments);

		// Set default settings
		this.settings.setDefaults({
			submitButton: {
				content: 'Submit',
			},
		});

		// Add the submit button
		this.addSubmitButton();
	},

	addSubmitButton: function() {
		this.submitButton = Html.button(this.settings.get('submitButton.content'));
        this.submitButton.on('interact', function(event) {
        	this.submit();
        }.bind(this));
        this.append(this.submitButton);
	},

	addFormFieldView: function(formFieldView) {
		// Append the form field to the view
		this.prepend(formFieldView);

		return formFieldView;
	},

	getData: function() {
		var data = {};

		this.children.each(function(childIndex, child) {
			if(Class.isInstance(child, FormFieldView)) {
				data[child.identifier] = child.getData();
			}
		}.bind(this));
		
		return data;
	},

	clear: function() {
		this.children.each(function(childIndex, child) {
			if(Class.isInstance(child, FormFieldView)) {
				child.clear();
			}
		}.bind(this));
	},

	getValidationErrors: function() {
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
	},

	submit: function() {
		var validationErrors = this.getValidationErrors();

		if(!validationErrors.length) {
			this.emit('form.submit', this.getData());
		}
		else {
			Console.error('failed validation', validationErrors);
		}
	},

	focusOnFirstFormField: function() {
		var firstChild = this.children.first();
		
		if(firstChild) {
			firstChild.focus();
		}
	},

});

// Export
module.exports = FormView;
// Dependencies
var View = Framework.require('system/web-interface/views/View.js');
var Settings = Framework.require('system/settings/Settings.js');
var FormFieldView = Framework.require('system/web-interface/views/forms/fields/FormFieldView.js');
var ButtonView = Framework.require('system/web-interface/views/buttons/ButtonView.js');

// Class
var FormView = View.extend({

	tag: 'form',

	settings: new Settings({
		submitButtonView: {
			content: 'Submit',
		},
	}),

	subviews: {
		submitButtonContainerView: null,
		submitButtonView: null,
	},

	createSubviews: function() {
		this.createSubmitButtonContainerView();
	},

	createSubmitButtonContainerView: function() {
		// Create the container
		this.subviews.submitButtonContainerView = new View();

		// Create the button
		this.subviews.submitButtonView = new ButtonView(this.settings.get('submitButtonView.content'));
        this.subviews.submitButtonView.on('input.press', function(event) {
        	this.submit();
        }.bind(this));

        // Add the button to the container
        this.subviews.submitButtonContainerView.append(this.subviews.submitButtonView);

        // Add the container to the view
        this.append(this.subviews.submitButtonContainerView);
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
				Console.standardInfo('child', child);
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
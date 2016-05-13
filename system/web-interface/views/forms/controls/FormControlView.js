// Dependencies
var View = Framework.require('system/web-interface/views/View.js');

// Class
var FormControlView = View.extend({

	attributes: {
		class: 'control',
	},

	value: null,
	originalValue: null,

	construct: function() {
		this.super.apply(this, arguments);

		this.on('form.control.change', function(event) {
            this.valueChangedOnDom();
        }.bind(this));

		this.originalValue = this.value;
	},

	getValue: function() {
		return this.value;
	},

	setValue: function(value) {
		this.value = this.domNode.value = value;

		return this.value;
	},

	clear: function() {
		return this.setValue(null);
	},

	reset: function() {
		return this.setValue(this.originalValue);
	},

	// Two-way data binding: if the user changes the value on the DOM, the FormControlView is updated to reflect the new value
	valueChangedOnDom: function() {
		//Console.log('Value changed on DOM, updating FormControlView');
		this.value = this.domNode.value;

		return this.value;
	},

});

// Static methods

FormControlView.is = function(value) {
	return Class.isInstance(value, FormControlView);
};

// Export
module.exports = FormControlView;
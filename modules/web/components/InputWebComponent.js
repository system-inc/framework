InputWebComponent = WebComponent.extend({

	value: null,
	originalValue: null,

	construct: function() {
		this.super.apply(this, arguments);

		this.originalValue = this.value;
	},

	getValue: function() {
		return this.value;
	},

	setValue: function(value) {
		this.value = this.domNode.value = value;

		return this.value;
	},

	reset: function() {
		this.setValue(this.originalValue);
	},

	// Two-way data binding: if the user changes the value on the DOM, the InputWebComponent is updated to reflect the new value
	valueChangedOnDomElement: function() {
		//console.log('Value changed on DOM, updating InputWebComponent');
		
		this.value = this.domNode.value;	

		return this.value;
	},

});
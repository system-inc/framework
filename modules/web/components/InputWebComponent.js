InputWebComponent = WebComponent.extend({

	value: null,

	getValue: function() {
		return this.value;
	},

	setValue: function(value) {
		this.value = this.domNode.value = value;

		return this.value;
	},

	// Two-way data binding: if the user changes the value on the DOM, the InputWebComponent is updated to reflect the new value
	valueChangedOnDomElement: function() {
		//console.log('Value changed on DOM, updating InputWebComponent');
		
		this.value = this.domNode.value;	

		return this.value;
	},

});
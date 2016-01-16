InputWebComponent = WebComponent.extend({

	getValue: function() {
		return this.element.domElement.value;
	},

	setValue: function(value) {
		this.element.domElement.value = value;

		return this.getValue();
	},

});
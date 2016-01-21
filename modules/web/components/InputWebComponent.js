InputWebComponent = WebComponent.extend({

	getValue: function() {
		return this.domElement.value;
	},

	setValue: function(value) {
		this.domElement.value = value;

		return this.getValue();
	},

});
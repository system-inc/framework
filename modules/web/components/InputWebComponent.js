InputWebComponent = WebComponent.extend({

	value: null,

	getValue: function() {
		if(this.domElement) {
			this.value = this.domElement.value;	
		}

		return this.value;
	},

	setValue: function(value) {
		this.value = this.domElement.value = value;

		return this.value;
	},

});
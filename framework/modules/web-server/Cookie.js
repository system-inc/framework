Cookie = Class.extend({

	construct: function(key, value) {
		this.key = key;
		this.value = value;
	},

	toHeaderString: function() {
		var headerString = this.key+'='+this.value+';';

		return headerString;
	},
	
});
// Class
var Header = Class.extend({

	key: null,
	value: null,

	construct: function(key, value) {
		this.key = key;
		this.value = value;
	},
	
});

// Export
module.exports = Header;
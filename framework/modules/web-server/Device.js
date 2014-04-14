Device = Class.extend({

	construct: function() {
		this.name = null;
		this.model = null;
		this.manufacturer = null;
		this.architecture = null;
	},

	constructFromUserAgent: function(userAgent) {
		return new Device();
	}
	
});

// Static methods
Device.constructFromUserAgent = Device.prototype.constructFromUserAgent;
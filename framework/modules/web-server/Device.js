Device = Class.extend({

	construct: function() {
		this.type = null; // mobile, tablet, desktop, robot
		this.name = null;
		this.model = null;
		this.manufacturer = null;
		this.architecture = null;
	},

	constructFromUserAgent: function(userAgent) {
		var device = new Device();

		if(userAgent.contains('iPhone', false)) {
			device.type = 'mobile';
			device.name = 'iPhone';
			device.manufacturer = 'Apple';
		}
		else if(userAgent.contains('iPod', false)) {
			device.type = 'mobile';
			device.name = 'iPod';
			device.manufacturer = 'Apple';
		}
		else if(userAgent.contains('iPad', false)) {
			device.type = 'tablet';
			device.name = 'iPad';
			device.manufacturer = 'Apple';
		}
		else {
			device.type = 'desktop';
		}

		return device;
	}
	
});

// Static methods
Device.constructFromUserAgent = Device.prototype.constructFromUserAgent;
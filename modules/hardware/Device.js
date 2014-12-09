Device = Class.extend({

	type: null, // mobile, tablet, desktop, robot
	name: null,
	model: null,
	manufacturer: null,
	architecture: null,

	construct: function() {
	},

	isMobile: function() {
		return this.type == 'mobile';
	},

	isTablet: function() {
		return this.type == 'tablet';
	},

	isDesktop: function() {
		return this.type == 'desktop';
	},
	
});

// Static methods
Device.constructFromUserAgent = function(userAgent) {
	var device = new Device();

	// Return immediately if there is no user agent
	if(!userAgent) {
		return device;
	}

	// Set the type, name, and manufacturer
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

	// Set the architecture
	if(userAgent.contains('WOW64', false)) {
		device.architecture = 'x64';
	}

	return device;
}
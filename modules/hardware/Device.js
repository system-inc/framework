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

	parseUserAgent: function(userAgent) {
		// Return immediately if there is no user agent
		if(!userAgent) {
			return this;
		}
		//Console.highlight(userAgent);

		// Set the type, name, and manufacturer
		if(userAgent.contains('iPhone')) {
			this.type = 'mobile';
			this.name = 'iPhone';
			this.manufacturer = 'Apple';
		}
		else if(userAgent.contains('iPod')) {
			this.type = 'mobile';
			this.name = 'iPod';
			this.manufacturer = 'Apple';
		}
		else if(userAgent.contains('iPad')) {
			this.type = 'tablet';
			this.name = 'iPad';
			this.manufacturer = 'Apple';
		}
		else if(userAgent.contains('Mac OS X')) {
			this.type = 'desktop';
			this.manufacturer = 'Apple';
		}

		// Set the architecture
		if(userAgent.contains('WOW64')) {
			this.architecture = 'x64';
		}

		return this;
	},
	
});

// Static methods
Device.constructFromUserAgent = function(userAgent) {
	var device = new Device();

	device.parseUserAgent(userAgent);

	return device;
}
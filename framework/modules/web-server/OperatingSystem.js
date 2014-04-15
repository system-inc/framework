OperatingSystem = Class.extend({

	construct: function() {
		this.name = null;
		this.manufacturer = null;
		this.version = {
			'version': null,
			'major': null,
			'minor': null,
			'patch': null,
		};
	},

	constructFromUserAgent: function(userAgent) {
		var operatingSystem = new OperatingSystem();

		// Get the operating system
		if(userAgent.contains('iPhone', false) || userAgent.contains('iPad', false) || userAgent.contains('iPod', false)) {
			operatingSystem.name = 'iOS';
			operatingSystem.manufacturer = 'Apple';
		}
		else if(userAgent.contains('OS X', false)) {
			operatingSystem.name = 'OS X';
			operatingSystem.manufacturer = 'Apple';
		}
		else if(userAgent.contains('Windows', false)) {
			operatingSystem.name = 'Windows';
			operatingSystem.manufacturer = 'Microsoft';
		}
		else if(userAgent.contains('Android', false)) {
			operatingSystem.name = 'Android';
			operatingSystem.manufacturer = 'Google';
		}

		return operatingSystem;
	}
	
});

// Static methods
OperatingSystem.constructFromUserAgent = OperatingSystem.prototype.constructFromUserAgent;
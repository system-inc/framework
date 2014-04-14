OperatingSystem = Class.extend({

	construct: function() {
		this.name = null;
		this.version = {
			'version': null,
			'major': null,
			'minor': null,
			'patch': null,
		};
	},

	constructFromUserAgent: function(userAgent) {
		var operatingSystem = new OperatingSystem();

		if(userAgent.contains('Mac OS X')) {
			operatingSystem.name = 'Mac OS X';
		}

		

		return new OperatingSystem();
	}
	
});

// Static methods
OperatingSystem.constructFromUserAgent = OperatingSystem.prototype.constructFromUserAgent;
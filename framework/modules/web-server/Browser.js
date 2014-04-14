Browser = Class.extend({

	construct: function() {
		this.name = null;
		this.version = {
			'version': null,
			'major': null,
			'minor': null,
			'patch': null,
			'patchMinor': null,
		};
		this.platform = null;
		this.operatingSystem = null;
		this.isMobile = this.isMobile();
		this.isRobot = this.isRobot();
	},

	constructFromUserAgent: function(userAgent) {
		return new Browser();
	},

	isMobile: function() {
		return null;
	},

	isRobot: function() {
		return null;
	}
	
});

// Static methods
Browser.constructFromUserAgent = Browser.prototype.constructFromUserAgent;
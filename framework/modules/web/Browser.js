Browser = Class.extend({

	construct: function() {
		this.name = null;
		this.manufacturer = null;
		this.version = new Version();
	},

	constructFromUserAgent: function(userAgent) {
		var browser = new Browser();

		// Return immediately if there is no user agent
		if(!userAgent) {
			return browser;
		}

		var browserIndex = null;
		var browsers = [
			{
				'userAgentString': 'Chrome',
				'name': 'Chrome',
				'manufacturer': 'Google',
			},
			{
				'userAgentString': 'Firefox',
				'name': 'Firefox',
				'manufacturer': 'Mozilla',
			},
			{
				'userAgentString': '[iPhone|iPad|iPod].*Safari',
				'name': 'Mobile Safari',
				'manufacturer': 'Apple',
			},
			{
				'userAgentString': 'Safari',
				'name': 'Safari',
				'manufacturer': 'Apple',
			},
			{
				'userAgentString': 'MSIE',
				'name': 'Internet Explorer',
				'manufacturer': 'Microsoft',
			},
		];

		// Detect the browser
		for(var key in browsers) {
			if(userAgent.contains(browsers[key].userAgentString, false)) {
				browser.name = browsers[key].name;
				browser.manufacturer = browsers[key].manufacturer;
				browserIndex = key;
				break;
			}
		}

		// Get the version and break it out into major, minor, patch, and patch minor
		if(browserIndex) {
			var browserVersionMatches = userAgent.match(new RegExp('^.*'+browsers[browserIndex].userAgentString+'.+?([\\d|\\.]+).*$', 'i'));
			if(browserVersionMatches && browserVersionMatches[1]) {
				browser.version = new Version(browserVersionMatches[1]);
			}
		}
		
		return browser;
	},
	
});

// Static methods
Browser.constructFromUserAgent = Browser.prototype.constructFromUserAgent;
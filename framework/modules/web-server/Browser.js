Browser = Class.extend({

	construct: function() {
		this.name = null;
		this.manufacturer = null;
		this.version = {
			'version': null,
			'major': null,
			'minor': null,
			'patch': null,
			'patchMinor': null,
		};
	},

	constructFromUserAgent: function(userAgent) {
		var browser = new Browser();
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
			if(browserVersionMatches[1]) {
				browser.version.version = browserVersionMatches[1];

				var browserVersions = browser.version.version.split('.');
				if(browserVersions[0]) {
					browser.version.major = browserVersions[0].toNumber();
				}
				if(browserVersions[1]) {
					browser.version.minor = browserVersions[1].toNumber();
				}
				if(browserVersions[2]) {
					browser.version.patch = browserVersions[2].toNumber();
				}
				if(browserVersions[3]) {
					browser.version.patchMinor = browserVersions[3].toNumber();
				}
			}
		}
		
		return browser;
	},
	
});

// Static methods
Browser.constructFromUserAgent = Browser.prototype.constructFromUserAgent;
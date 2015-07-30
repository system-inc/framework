Browser = Class.extend({

	name: null,
	manufacturer: null,
	version: null,
	userAgent: null,

	construct: function() {
	},

	parseUserAgent: function(userAgent) {
		// Return immediately if there is no user agent
		if(!userAgent) {
			return this;
		}

		// Store the user agent
		this.userAgent = userAgent;

		// Detect the matching browser
		var matchingBrowser = null;
		Browser.browsers.each(function(index, browser) {
			if(userAgent.contains(new RegularExpression(browser.userAgentRegularExpressionString, 'i'))) {
				matchingBrowser = browser;
				return false; // break
			}
		});

		// Get the version and break it out into major, minor, patch, and patch minor
		if(matchingBrowser !== null) {
			this.name = matchingBrowser.name;
			this.manufacturer = matchingBrowser.manufacturer;

			var browserVersionRegularExpressionString = '^.*'+matchingBrowser.userAgentRegularExpressionString+'.+?([\\d|\\.]+).*$';
			//Console.highlight(browserVersionRegularExpressionString);
			var browserVersionMatches = userAgent.match(new RegularExpression(browserVersionRegularExpressionString, 'i'));
			if(browserVersionMatches && browserVersionMatches[1]) {
				this.version = new Version(browserVersionMatches[1]);
			}
		}
		
		return this;
	},
	
});

// Static methods
Browser.constructFromUserAgent = function(userAgent) {
	var browser = new Browser();

	browser.parseUserAgent(userAgent);

	return browser;
}

// Static properties
Browser.browsers = [
	{
		'name': 'Chrome',
		'manufacturer': 'Google',
		'userAgentRegularExpressionString': 'Chrome',
	},
	{
		'name': 'Firefox',
		'manufacturer': 'Mozilla',
		'userAgentRegularExpressionString': 'Firefox',
	},
	{
		'name': 'Mobile Safari',
		'manufacturer': 'Apple',
		'userAgentRegularExpressionString': '[iPhone|iPad|iPod].*Safari',
	},
	{
		'name': 'Safari',
		'manufacturer': 'Apple',
		'userAgentRegularExpressionString': 'Safari',
	},
	{
		'name': 'Internet Explorer',
		'manufacturer': 'Microsoft',
		'userAgentRegularExpressionString': 'MSIE',
	},
];
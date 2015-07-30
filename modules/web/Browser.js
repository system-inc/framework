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
		'userAgentRegularExpressionString': 'Chrome',
		'name': 'Chrome',
		'manufacturer': 'Google',
	},
	{
		'userAgentRegularExpressionString': 'Firefox',
		'name': 'Firefox',
		'manufacturer': 'Mozilla',
	},
	{
		'userAgentRegularExpressionString': '[iPhone|iPad|iPod].*Safari',
		'name': 'Mobile Safari',
		'manufacturer': 'Apple',
	},
	{
		'userAgentRegularExpressionString': 'Safari',
		'name': 'Safari',
		'manufacturer': 'Apple',
	},
	{
		'userAgentRegularExpressionString': 'MSIE',
		'name': 'Internet Explorer',
		'manufacturer': 'Microsoft',
	},
];
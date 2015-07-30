Browser = Class.extend({

	name: null,
	manufacturer: null,
	version: null,
	userAgent: null,

	construct: function() {
	},
	
});

// Static methods
Browser.constructFromUserAgent = function(userAgent) {
	var browser = new Browser();

	// Return immediately if there is no user agent
	if(!userAgent) {
		return browser;
	}

	browser.userAgent = userAgent;

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
	
	// Detect the matching browser
	var matchingBrowser = null;
	browsers.each(function(currentBrowserIndex, currentBrowser) {
		if(userAgent.contains(new RegularExpression(currentBrowser.userAgentString, 'i'))) {
			matchingBrowser = currentBrowser;
			return false; // break
		}
	});

	// Get the version and break it out into major, minor, patch, and patch minor
	if(matchingBrowser !== null) {
		browser.name = matchingBrowser.name;
		browser.manufacturer = matchingBrowser.manufacturer;

		var browserVersionRegularExpressionString = '^.*'+matchingBrowser.userAgentString+'.+?([\\d|\\.]+).*$';
		//Console.highlight(browserVersionRegularExpressionString);
		var browserVersionMatches = userAgent.match(new RegularExpression(browserVersionRegularExpressionString, 'i'));
		if(browserVersionMatches && browserVersionMatches[1]) {
			browser.version = new Version(browserVersionMatches[1]);
		}
	}
	
	return browser;
}
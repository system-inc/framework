Browser = Class.extend({

	name: null,
	manufacturer: null,
	version: null,

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
	browsers.each(function(index, value) {
		if(userAgent.contains(new RegularExpression(value.userAgentString, 'gi'))) {
			browser.name = value.name;
			browser.manufacturer = value.manufacturer;
			browserIndex = index;
			return false; // break
		}
	});

	// Get the version and break it out into major, minor, patch, and patch minor
	if(browserIndex) {
		var browserVersionMatches = userAgent.match(new RegularExpression('^.*'+browsers[browserIndex].userAgentString+'.+?([\\d|\\.]+).*$', 'i'));
		if(browserVersionMatches && browserVersionMatches[1]) {
			browser.version = new Version(browserVersionMatches[1]);
		}
	}
	
	return browser;
}
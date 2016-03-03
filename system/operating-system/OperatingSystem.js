// Dependencies
var Version = Framework.require('system/version/Version.js');

// Class
var OperatingSystem = Class.extend({

	name: null,
	manufacturer: null,
	version: null,

	parseUserAgent: function(userAgent) {
		// Return immediately if there is no user agent
		if(!userAgent) {
			return this;
		}
		//Console.highlight(userAgent);

		// Detect the matching operating system
		var matchingOperatingSystem = null;
		OperatingSystem.operatingSystems.each(function(index, operatingSystem) {
			var userAgentMatch = userAgent.match(new RegularExpression('^.*'+operatingSystem.userAgentRegularExpressionString+'.*$', 'i'));
			if(userAgentMatch) {
				matchingOperatingSystem = operatingSystem;
				return false; // break
			}
		});
		//Console.highlight(matchingOperatingSystem);

		// Get the version and break it out into major, minor, patch, and patch minor
		if(matchingOperatingSystem !== null) {
			this.name = matchingOperatingSystem.name;
			this.manufacturer = matchingOperatingSystem.manufacturer;

			var operatingSystemVersionRegularExpressionString = '^.*'+matchingOperatingSystem.userAgentRegularExpressionString+'.+?([\\d\\._]+).*$';
			//Console.highlight(operatingSystemVersionRegularExpressionString);
			var operatingSystemVersionMatches = userAgent.match(new RegularExpression(operatingSystemVersionRegularExpressionString, 'i'));
			if(operatingSystemVersionMatches && operatingSystemVersionMatches[1]) {
				this.version = new Version(operatingSystemVersionMatches[1]);
			}
		}

		// Handle Windows names
		if(this.name == 'Windows') {
			if(this.version.major <= 4) {
				this.name = 'Windows NT';
			}
			else if(this.version.major == 5 && this.version.minor == 0) {
				this.name = 'Windows 2000';
			}
			else if(this.version.major == 5 && this.version.minor >= 1) {
				this.name = 'Windows XP';
			}
			else if(this.version.major == 6 && this.version.minor == 0) {
				this.name = 'Windows Vista';
			}
			else if(this.version.major == 6 && this.version.minor <= 1) {
				this.name = 'Windows 7';
				this.version.major = 7;
				this.version.minor = 0;
				this.version.patch = null;
			}
			else if(this.version.major == 6 && this.version.minor == 2) {
				this.name = 'Windows 8';
				this.version.major = 8;
				this.version.minor = 0;
				this.version.patch = null;
			}
			else if(this.version.major == 6 && this.version.minor == 3) {
				this.name = 'Windows 8';
				this.version.major = 8;
				this.version.minor = 1;
				this.version.patch = null;
			}
		}
		
		return this;
	},
	
});

// Static properties

OperatingSystem.operatingSystems = [
	{
		'name': 'iOS',
		'manufacturer': 'Apple',
		'userAgentRegularExpressionString': 'iPad',
	},
	{
		'name': 'iOS',
		'manufacturer': 'Apple',
		'userAgentRegularExpressionString': 'iPhone',
	},
	{
		'name': 'iOS',
		'manufacturer': 'Apple',
		'userAgentRegularExpressionString': 'iPod',
	},
	{
		'name': 'OS X',
		'manufacturer': 'Apple',
		'userAgentRegularExpressionString': 'OS X',
	},
	{
		'name': 'Windows',
		'manufacturer': 'Microsoft',
		'userAgentRegularExpressionString': 'Windows',
	},
	{
		'name': 'Android',
		'manufacturer': 'Google',
		'userAgentRegularExpressionString': 'Android',
	},
];

// Static methods

OperatingSystem.constructFromUserAgent = function(userAgent) {
	var operatingSystem = new OperatingSystem();

	operatingSystem.parseUserAgent(userAgent);

	return operatingSystem;	
};

// Export
module.exports = OperatingSystem;
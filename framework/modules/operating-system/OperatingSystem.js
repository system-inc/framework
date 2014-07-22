OperatingSystem = Class.extend({

	name: null,
	manufacturer: null,
	version: null,

	construct: function() {
	},

	constructFromUserAgent: function(userAgent) {
		var operatingSystem = new OperatingSystem();

		// Return immediately if there is no user agent
		if(!userAgent) {
			return operatingSystem;
		}

		var operatingSystemIndex = null;
		var operatingSystems = [
			{
				'userAgentString': 'iPad',
				'name': 'iOS',
				'manufacturer': 'Apple',
			},
			{
				'userAgentString': 'iPhone',
				'name': 'iOS',
				'manufacturer': 'Apple',
			},
			{
				'userAgentString': 'iPod',
				'name': 'iOS',
				'manufacturer': 'Apple',
			},
			{
				'userAgentString': 'OS X',
				'name': 'OS X',
				'manufacturer': 'Apple',
			},
			{
				'userAgentString': 'Windows',
				'name': 'Windows',
				'manufacturer': 'Microsoft',
			},
			{
				'userAgentString': 'Android',
				'name': 'Android',
				'manufacturer': 'Google',
			},
		];

		// Detect the operating system
		for(var key in operatingSystems) {
			var userAgentMatch = userAgent.match(new RegExp('^.*'+operatingSystems[key].userAgentString+'.*$', 'i'));
			//Log.log(operatingSystems[key].name, userAgentMatch);
			if(userAgentMatch) {
				operatingSystem.name = operatingSystems[key].name;
				operatingSystem.manufacturer = operatingSystems[key].manufacturer;
				operatingSystemIndex = key;
				break;
			}
		}

		// Get the version and break it out into major, minor, patch, and patch minor
		if(operatingSystemIndex) {
			var operatingSystemVersionMatches = userAgent.match(new RegExp('^.*'+operatingSystems[operatingSystemIndex].userAgentString+'.+?([\\d\\._]+).*$', 'i'));
			//Log.log(operatingSystemVersionMatches);
			if(operatingSystemVersionMatches && operatingSystemVersionMatches[1]) {
				operatingSystem.version = new Version(operatingSystemVersionMatches[1]);
			}
		}

		// Handle Windows names
		if(operatingSystem.name == 'Windows') {
			if(operatingSystem.version.major <= 4) {
				operatingSystem.name = 'Windows NT';
			}
			else if(operatingSystem.version.major == 5 && operatingSystem.version.minor == 0) {
				operatingSystem.name = 'Windows 2000';
			}
			else if(operatingSystem.version.major == 5 && operatingSystem.version.minor >= 1) {
				operatingSystem.name = 'Windows XP';
			}
			else if(operatingSystem.version.major == 6 && operatingSystem.version.minor == 0) {
				operatingSystem.name = 'Windows Vista';
			}
			else if(operatingSystem.version.major == 6 && operatingSystem.version.minor <= 1) {
				operatingSystem.name = 'Windows 7';
				operatingSystem.version.major = 7;
				operatingSystem.version.minor = 0;
				operatingSystem.version.patch = null;
			}
			else if(operatingSystem.version.major == 6 && operatingSystem.version.minor == 2) {
				operatingSystem.name = 'Windows 8';
				operatingSystem.version.major = 8;
				operatingSystem.version.minor = 0;
				operatingSystem.version.patch = null;
			}
			else if(operatingSystem.version.major == 6 && operatingSystem.version.minor == 3) {
				operatingSystem.name = 'Windows 8';
				operatingSystem.version.major = 8;
				operatingSystem.version.minor = 1;
				operatingSystem.version.patch = null;
			}
		}
		
		return operatingSystem;
	}
	
});

// Static methods
OperatingSystem.constructFromUserAgent = OperatingSystem.prototype.constructFromUserAgent;
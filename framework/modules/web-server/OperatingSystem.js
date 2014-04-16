OperatingSystem = Class.extend({

	construct: function() {
		this.name = null;
		this.manufacturer = null;
		this.version = {
			'version': null,
			'major': null,
			'minor': null,
			'patch': null,
		};
	},

	constructFromUserAgent: function(userAgent) {
		var operatingSystem = new OperatingSystem();

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
			//console.log(operatingSystems[key].name, userAgentMatch);
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
			//console.log(operatingSystemVersionMatches);
			if(operatingSystemVersionMatches[1]) {
				operatingSystemVersionMatches[1] = operatingSystemVersionMatches[1].replace('_', '.');
				operatingSystem.version.version = operatingSystemVersionMatches[1];

				var operatingSystemVersions = operatingSystem.version.version.split('.');
				if(operatingSystemVersions[0]) {
					operatingSystem.version.major = operatingSystemVersions[0].toNumber();
				}
				if(operatingSystemVersions[1]) {
					operatingSystem.version.minor = operatingSystemVersions[1].toNumber();
				}
				if(operatingSystemVersions[2]) {
					operatingSystem.version.patch = operatingSystemVersions[2].toNumber();
				}
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
				operatingSystem.version.version = operatingSystem.version.major+'.'+operatingSystem.version.minor;
			}
			else if(operatingSystem.version.major == 6 && operatingSystem.version.minor == 2) {
				operatingSystem.name = 'Windows 8';
				operatingSystem.version.major = 8;
				operatingSystem.version.minor = 0;
				operatingSystem.version.patch = null;
				operatingSystem.version.version = operatingSystem.version.major+'.'+operatingSystem.version.minor;
			}
			else if(operatingSystem.version.major == 6 && operatingSystem.version.minor == 3) {
				operatingSystem.name = 'Windows 8';
				operatingSystem.version.major = 8;
				operatingSystem.version.minor = 1;
				operatingSystem.version.patch = null;
				operatingSystem.version.version = operatingSystem.version.major+'.'+operatingSystem.version.minor;
			}
		}
		
		return operatingSystem;
	}
	
});

// Static methods
OperatingSystem.constructFromUserAgent = OperatingSystem.prototype.constructFromUserAgent;
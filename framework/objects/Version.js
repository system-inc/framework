Version = Class.extend({

	major: null,
	minor: null,
	path: null,
	patchMinor: null,

	construct: function(options) {
		// Construct from a string
		if(options && options.isString()) {
			var versions = options.replace('_', '.').split('.');
			if(versions[0]) {
				this.major = versions[0].toNumber();
			}
			if(versions[1]) {
				this.minor = versions[1].toNumber();
			}
			if(versions[2]) {
				this.patch = versions[2].toNumber();
			}
			if(versions[3]) {
				this.patchMinor = versions[3].toNumber();
			}
		}
		// Construct from an object
		else if(options && options.isObject()) {
			if(options.major) {
				this.major = options.major;
			}
			if(options.minor) {
				this.minor = options.minor;
			}
			if(options.patch) {
				this.patch = options.patch;
			}
			if(options.patchMinor) {
				this.patchMinor = options.patchMinor;
			}	
		}
	},

	toString: function() {
		var version = '';

		// Major
		if(this.major) {
			version = this.major;
		}
		else {
			version = '0';
		}

		// Minor
		if(this.minor) {
			version += '.'+this.minor;
		}
		else {
			version += '.0';
		}

		// Patch
		if(this.minor != null && this.patch != null) {
			version += '.'+this.patch;
		}

		// Patch minor
		if(this.patch != null && this.patchMinor != null) {
			version += '.'+this.patchMinor;
		}

		return version;
	},
	
});
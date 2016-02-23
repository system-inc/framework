// Globals
//Version = Framework.require('modules/version/Version.js'); // This is a special case as it is already set as a global in Framework.js

// Class
var VersionModule = Module.extend({

	version: new Version('0.1.0'),
	
});

// Export
module.exports = VersionModule;
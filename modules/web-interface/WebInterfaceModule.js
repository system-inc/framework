// Dependencies
var Module = Framework.require('modules/module/Module.js');
var Version = Framework.require('modules/version/Version.js');

// Class
var WebModule = Module.extend({

	version: new Version('1.0'),
	
});

// Export
module.exports = WebModule;
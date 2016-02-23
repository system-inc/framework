// Dependencies
var Module = Framework.require('modules/module/Module.js');
var Version = Framework.require('modules/version/Version.js');

// Class
var DataModule = Module.extend({

	version: new Version('0.1.0'),
	
});

// Export
module.exports = DataModule;
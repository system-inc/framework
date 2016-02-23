// Globals
Test = Framework.require('modules/test/Test.js');
Assert = Framework.require('modules/test/Assert.js');
Proctor = Framework.require('modules/test/Proctor.js');

// Class
var TestModule = Module.extend({

	version: new Version('0.1.0'),
	
});

// Export
module.exports = TestModule;
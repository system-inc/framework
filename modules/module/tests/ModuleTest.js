// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');

// Class
var ModuleTest = Test.extend({

	testInitialize: function() {
		// Console is a core module so it should already have been initialized
		Assert.true(Object.hasKey(Project.modules.consoleModule, 'settings'), 'ConsoleModule has key "settings" after Module.initialize()');
	},

});

// Export
module.exports = ModuleTest;
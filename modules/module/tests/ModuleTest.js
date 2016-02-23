// Dependencies
var Test = Framework.require('modules/test/Test.js');
var Assert = Framework.require('modules/test/Assert.js');

// Class
var ModuleTest = Test.extend({

	testInitialize: function() {
		// Hardware is a core module so it should already have been initialized, this test should be renamed or moved
		Assert.true(Object.hasKey(Project.modules.hardwareModule, 'settings'), 'HardwareModule has key "settings" after Module.initialize()');
	},

});

// Export
module.exports = ModuleTest;
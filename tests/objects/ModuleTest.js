ModuleTest = Test.extend({

	testInitialize: function() {
		// Hardware is a core module so it should already have been initialized, this test should be renamed or moved
		Assert.true(Object.hasKey(HardwareModule, 'settings'), 'HardwareModule has settings key after Module.initialize');
	},

});
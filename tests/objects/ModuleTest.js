ModuleTest = Test.extend({

	testLoad: function() {
		Assert.doesNotThrow(function() {
			Module.load('Hardware');
		}, 'loading HardwareModule');

		Assert.true(Hardware, 'Hardware class exists after Module.load');
	},

	testInitialize: function() {
		Assert.doesNotThrow(function() {
			Module.initialize('Hardware');
		}, 'initializing HardwareModule');

		Assert.true(Object.hasKey(HardwareModule, 'settings'), 'HardwareModule has settings key after Module.initialize');
	},

});
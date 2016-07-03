// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');

// Class
var ElectronManagerTest = ElectronTest.extend({

	testElectronManager: function*() {
		Assert.true(Object.hasKey(Node.Process.versions, 'electron'), 'Electron version is set');
	},

});

// Export
module.exports = ElectronManagerTest;
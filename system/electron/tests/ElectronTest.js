// Dependencies
var Test = Framework.require('system/test/Test.js');
var Assert = Framework.require('system/test/Assert.js');

// Class
var ElectronTest = Test.extend({

	shouldRun: function*() {
		var shouldRun = true;

		// If electron isn't in the versions object, we are not in the Electron environment
		if(!Node.Process.versions.electron) {
			shouldRun = false;
		}		

		return shouldRun;
	},

	testElectron: function*() {
		Assert.true(Object.hasKey(Node.Process.versions, 'electron'), 'Electron version is set');
	},

});

// Export
module.exports = ElectronTest;
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

	// This is an abstract class, do not add any tests here

});

// Export
module.exports = ElectronTest;
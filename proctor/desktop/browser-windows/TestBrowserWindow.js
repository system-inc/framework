// Dependencies
var Reusable = Framework.require('system/pool/Reusable.js');
var Electron = Node.require('electron');

// Class
var TestBrowserWindow = Reusable.extend({

	status: null,
	testMethod: null,

	initialize: function() {
		// Set the initial status
		this.status = 'waitingForApplicationToCreateTestBrowserWindow';

        // Send a message to the main process to create a testBrowserWindow
        Electron.ipcRenderer.send('mainBrowserWindow.createTestBrowserWindow', this.uniqueIdentifier);

        // Do not call this.super() as we are not available until the application creates a test browser window
	},

	runTestMethod: function(testMethod) {
		Console.standardLog('runTestMethod', testMethod);

		this.testMethod = testMethod;

		// Update the status
		this.status = 'runningTest';

		// Command the testBrowserWindow to run the test method
        Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'runTestMethod', {
            testClassFilePath: this.testMethod.class.file.path,
            testClassName: this.testMethod.class.name,
            testMethodName: this.testMethod.name,
        });
	},
	
});

// Export
module.exports = TestBrowserWindow;
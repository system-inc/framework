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

        // Do not call super() as we are not available until the application creates a test browser window
        // MainBrowserWindow.handleTestBrowserWindowReport will call release() on this when it is ready
	},

	runTestMethod: function(testMethod) {
		//Console.standardLog('runTestMethod', testMethod);

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

	openDeveloperTools: function() {
		//Console.standardWarn('openDeveloperTools');
		Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'openDeveloperTools', {});
	},

	show: function() {
		//Console.standardWarn('TestBrowserWindow show');
		Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'show', {});
	},

	retire: function() {
		//Console.standardWarn('TestBrowserWindow retire');
		Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'close', {});

		super.retire();
	},
	
});

// Export
module.exports = TestBrowserWindow;
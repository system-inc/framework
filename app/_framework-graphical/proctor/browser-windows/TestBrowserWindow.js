// Dependencies
import Reusable from 'framework/system/pool/Reusable.js';
import Electron from 'electron';

// Class
class TestBrowserWindow extends Reusable {

	status = null;
	testMethod = null;

	initialize() {
		// Set the initial status
		this.status = 'waitingForApplicationToCreateTestBrowserWindow';

        // Send a message to the main process to create a testBrowserWindow
        Electron.ipcRenderer.send('mainBrowserWindow.createTestBrowserWindow', this.uniqueIdentifier);

        // Do not call super() as we are not available until the application creates a test browser window
        // MainBrowserWindow.handleTestBrowserWindowReport will call release() on this when it is ready
	}

	runTestMethod(testMethod) {
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
	}

	openDeveloperTools() {
		//Console.standardWarn('openDeveloperTools');
		Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'openDeveloperTools', {});
	}

	show() {
		//Console.standardWarn('TestBrowserWindow show');
		Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'show', {});
	}

	retire() {
		//Console.standardWarn('TestBrowserWindow retire');
		Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'close', {});

		super.retire();
	}
	
}

// Export
export default TestBrowserWindow;

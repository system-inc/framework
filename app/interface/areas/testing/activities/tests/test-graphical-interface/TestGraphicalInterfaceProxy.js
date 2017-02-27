// Dependencies
import Reusable from 'framework/system/pool/Reusable.js';
import Electron from 'electron';

// Class
class TestGraphicalInterfaceProxy extends Reusable {

	status = null;
	graphicalInterface = null;
	testMethod = null;

	resetWhenFinishedRunningTests = true;

	async initialize() {
		// Set the initial status
		this.status = 'waitingForGraphicalInterfaceToBeCreated';

		//this.graphicalInterface = app.interfaces.graphicalInterfaceManager.createGraphicalInterface();

        // Send a message to the main process to create a testGraphicalInterface
        //console.info('Sending mainGraphicalInterface.createTestGraphicalInterfaceProxy');
        //Electron.ipcRenderer.send('mainGraphicalInterface.createTestGraphicalInterfaceProxy', this.uniqueIdentifier);

        // Do not call super() as we are not available until the application creates a test browser window
        // MainGraphicalInterface.handleTestGraphicalInterfaceProxyReport will call release() on this when it is ready
	}

	runTestMethod(testMethod) {
		//console.log('runTestMethod', testMethod);

		this.testMethod = testMethod;

		// Update the status
		this.status = 'runningTest';

		// Command the testGraphicalInterface to run the test method
        Electron.ipcRenderer.send('mainGraphicalInterface.commandTestGraphicalInterfaceProxy', this.uniqueIdentifier, 'runTestMethod', {
            testClassFilePath: this.testMethod.class.file.path,
            testClassName: this.testMethod.class.name,
            testMethodName: this.testMethod.name,
        });
	}

	openDeveloperTools() {
		//console.warn('openDeveloperTools');
		Electron.ipcRenderer.send('mainGraphicalInterface.commandTestGraphicalInterfaceProxy', this.uniqueIdentifier, 'openDeveloperTools', {});
	}

	show() {
		//console.warn('TestGraphicalInterfaceProxy show');
		Electron.ipcRenderer.send('mainGraphicalInterface.commandTestGraphicalInterfaceProxy', this.uniqueIdentifier, 'show', {});
	}

	retire() {
		//console.warn('TestGraphicalInterfaceProxy retire');
		Electron.ipcRenderer.send('mainGraphicalInterface.commandTestGraphicalInterfaceProxy', this.uniqueIdentifier, 'close', {});

		super.retire();
	}
	
}

// Export
export default TestGraphicalInterfaceProxy;

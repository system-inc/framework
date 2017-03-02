// Dependencies
import Reusable from 'framework/system/pool/Reusable.js';
import Electron from 'electron';

// Class
class TestGraphicalInterfaceProxy extends Reusable {

	graphicalInterfaceProxy = null;
	testMethod = null;

	resetWhenFinishedRunningTests = true;

	async initialize() {
		// Create a new graphical interface
		this.graphicalInterfaceProxy = await app.interfaces.graphical.newGraphicalInterface({
			path: Node.Path.join(app.directory, 'interface', 'areas', 'testing', 'activities', 'tests', 'test-graphical-interface', 'app', 'index.html'),
			type: 'test',
		});

		// When the graphical interface is ready, release the reusable into the pool
		this.graphicalInterfaceProxy.on('ready', function() {
			console.log('child graphical interface proxy is ready, releasing into the pool!');
			this.release();
		}.bind(this));
	}

	runTestMethod(testMethod) {
		console.log('runTestMethod', testMethod);

		this.testMethod = testMethod;

		// Command the testGraphicalInterface to run the test method
		this.graphicalInterfaceProxy.sendMessage('runTestMethod', {
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

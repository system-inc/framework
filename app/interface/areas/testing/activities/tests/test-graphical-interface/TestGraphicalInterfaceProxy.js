// Dependencies
import Reusable from 'framework/system/pool/Reusable.js';

// Class
class TestGraphicalInterfaceProxy extends Reusable {

	graphicalInterfaceProxy = null;
	testMethod = null;

	resetWhenFinishedRunningTests = true;

	async initialize() {
		// Create a new graphical interface
		//console.log('TestGraphicalInterfaceProxy - creating new graphical interface...');
		this.graphicalInterfaceProxy = await app.interfaces.graphical.newGraphicalInterface({
			path: Node.Path.join(app.directory, 'interface', 'areas', 'testing', 'activities', 'tests', 'test-graphical-interface', 'app', 'TestGraphicalInterfaceApp.js'),
			type: 'test',
		});

		//this.graphicalInterfaceProxy.on('*', function(event) {
		//	console.warn('this.graphicalInterfaceProxy.on event', event.identifier, event);
		//});

		// When the graphical interface is ready, release the reusable into the pool
		this.graphicalInterfaceProxy.on('testGraphicalInterfaceApp.ready', function() {
			//console.log('child graphical interface proxy is ready, releasing into the pool!');
			this.release();
		}.bind(this));

		this.graphicalInterfaceProxy.on('graphicalInterface.closed', function() {
			//console.log('child graphical interface proxy is closed, retiring');
			this.retire();
		}.bind(this));
	}

	on() {
		return this.addEventListener(...arguments);
	}

	addEventListener() {
		return this.graphicalInterfaceProxy.addEventListener.apply(this.graphicalInterfaceProxy, arguments);
	}

	reset() {
		this.graphicalInterfaceProxy.removeEventListener('testGraphicalInterfaceApp.proctor.*');
		this.graphicalInterfaceProxy.reload();
		return this;
	}

	retire() {
		var retire = null;

		// If the graphical interface is already closed
		if(this.graphicalInterfaceProxy.closed) {
			retire = this.closed();
		}
		else {
			retire = this.close();
		}

		return retire;
	}

	close() {
		return this.graphicalInterfaceProxy.close();
	}

	closed() {
		return super.retire();
	}

	runTestMethod(testMethod) {
		//console.log('runTestMethod', testMethod);

		this.testMethod = testMethod;

		// Command the testGraphicalInterface to run the test method
		this.graphicalInterfaceProxy.emit('testGraphicalInterfaceApp.runTestMethod', {
			testClassFilePath: this.testMethod.class.file.path,
            testClassName: this.testMethod.class.name,
            testMethodName: this.testMethod.name,
		});
	}

	openDeveloperTools() {
		return this.graphicalInterfaceProxy.openDeveloperTools();
	}

	show() {
		return this.graphicalInterfaceProxy.show();
	}
	
}

// Export
export default TestGraphicalInterfaceProxy;

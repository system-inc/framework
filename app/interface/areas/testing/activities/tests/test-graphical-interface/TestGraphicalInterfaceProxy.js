// Dependencies
import { Reusable } from '@framework/system/pool/Reusable.js';

// Class
class TestGraphicalInterfaceProxy extends Reusable {

	graphicalInterface = null;
	testMethod = null;

	resetWhenFinishedRunningTests = true;

	async initialize() {
		// Create a new graphical interface
		//console.log('TestGraphicalInterfaceProxy - creating new graphical interface...');
		let url = Node.Url.pathToFileURL(Node.Path.join(app.path, 'interface/areas/testing/activities/tests/test-graphical-interface/app/electron.html')).toString();
		this.graphicalInterface = await app.interfaces.graphical.newGraphicalInterface('test', {
			url: url,
		});
		// console.log('this.graphicalInterface', this.graphicalInterface);

		this.graphicalInterface.on('*', function(event) {
			console.info('TestGraphicalInterfaceProxy event', event.identifier, event);
		});

		// When the graphical interface is ready, release the reusable into the pool
		this.graphicalInterface.on('testGraphicalInterfaceApp.ready', function() {
			// console.log('TestGraphicalInterfaceProxy is ready, releasing into the pool!');
			this.release();
		}.bind(this));

		this.graphicalInterface.on('graphicalInterface.closed', function() {
			console.log('TestGraphicalInterfaceProxy closed, retiring...');
			this.retire();
		}.bind(this));
	}

	on() {
		return this.addEventListener(...arguments);
	}

	addEventListener() {
		return this.graphicalInterface.addEventListener.apply(this.graphicalInterface, arguments);
	}

	reset() {
		// this.graphicalInterface.removeEventListener('testGraphicalInterfaceApp.proctor.*');
		this.graphicalInterface.reload();
		return this;
	}

	retire() {
		var retire = null;

		// If the graphical interface is already closed
		if(this.graphicalInterface.state.closed) {
			console.log('Retiring - test graphical interface is already closed');
			retire = this.closed();
		}
		else {
			console.log('Retiring - test graphical interface needs to close');
			retire = this.close();
		}

		return retire;
	}

	close() {
		return this.graphicalInterface.close();
	}

	closed() {
		return super.retire();
	}

	runTestMethod(testMethod) {
		// app.log('runTestMethod', testMethod);

		this.testMethod = testMethod;

		// Command the testGraphicalInterface to run the test method
		this.graphicalInterface.emit(
			'testGraphicalInterfaceApp.runTestMethod', {
				testClassFilePath: this.testMethod.class.file.path,
            	testClassName: this.testMethod.class.name,
            	testMethodName: this.testMethod.name,
			},
			{
				propagationStopped: true,
			}
		);
	}

	openDeveloperTools() {
		return this.graphicalInterface.openDeveloperTools();
	}

	show() {
		return this.graphicalInterface.show();
	}
	
}

// Export
export { TestGraphicalInterfaceProxy };

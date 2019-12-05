// Globals
import 'framework/globals/Globals.js';

// Dependencies
import App from 'framework/system/app/App.js';
import Proctor from 'framework/system/test/Proctor.js';

// Class
class TestGraphicalInterfaceApp extends App {

	async initialize() {
		await super.initialize(...arguments);

		console.info('Ready for command...');

		// Tell the parent we are ready
		this.interfaces.graphical.emit('testGraphicalInterfaceApp.ready');

		//this.interfaces.graphical.on('*', function(event) {
		//	console.info('graphical interface event', event.identifier, event);
		//});

		this.interfaces.graphical.on('testGraphicalInterfaceApp.runTestMethod', function(event) {
			//console.info('graphical interface event', event.identifier, event);
			this.runTestMethod(event.data.testClassFilePath, event.data.testClassName, event.data.testMethodName);
		}.bind(this));
	}

	async runTestMethod(testClassFilePath, testClassName, testMethodName) {
        // Set the page title - must use document. as we do not have an HtmlDocument object
        document.title = testClassName+'.'+testMethodName+' \u2022 Tests \u2022 Testing \u2022 Framework';

        var proctor = new Proctor('electron', true);

        var proctorEvents = [
            //'proctor.startedRunningTests',
            //'proctor.startedRunningTest',
            'proctor.startedRunningTestMethod',
            'proctor.finishedRunningTestMethod',
            //'proctor.finishedRunningTest',
            'proctor.finishedRunningTests',
        ];

        proctorEvents.each(function(proctorEventIndex, proctorEvent) {
            proctor.on(proctorEvent, function(event) {
            	//console.log(event);

            	// Log errors
            	if(event.identifier === 'proctor.finishedRunningTestMethod') {
            		var error = event.getValueByPath('data.failedTestMethods.0.error');
                	if(error) {
                		console.error(error.toString());
                	}
            	}

            	this.interfaces.graphical.emit('testGraphicalInterfaceApp.'+event.identifier, {
					status: proctorEvent,
					data: event.data,
            	});
            }.bind(this));
        }.bind(this));

        proctor.getAndRunTestMethod(testClassFilePath, testClassName, testMethodName);
	}

}

// Global instance
global.app = new TestGraphicalInterfaceApp(__dirname);

// Initialize
global.app.initialize();

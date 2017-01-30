// Dependencies
import Reusable from 'framework/system/pool/Reusable.js';
import Electron from 'electron';

// Class
class TestBrowserWindow extends Reusable {

	status = null;
	testMethod = null;

	initialize() {
		// Set the initial status
		this.status = 'waitingForFrameworkAppToCreateTestBrowserWindow';

        // Send a message to the main process to create a testBrowserWindow
        Electron.ipcRenderer.send('electronMainBrowserWindow.createTestBrowserWindow', this.uniqueIdentifier);

        // Do not call super() as we are not available until the application creates a test browser window
        // MainBrowserWindow.handleTestBrowserWindowReport will call release() on this when it is ready
	}

	renameThisFunction() {
        // Set the testBrowserWindowUniqueIdentifier - must use window. as we do not have an HtmlDocument object
        var testBrowserWindowUniqueIdentifier = window.location.hash.replace('#', '');
        //app.log('testBrowserWindowUniqueIdentifier', testBrowserWindowUniqueIdentifier);

        // Handle commands from the mainBrowserWindow
        Electron.ipcRenderer.on('electronMainBrowserWindow.commandTestBrowserWindow', function(eventFromIpcMain, command, data) {
            //Console.standardLog(command, data);

            // runTestMethod
            if(command == 'runTestMethod') {
                var testClassFilePath = data.testClassFilePath;
                var testClassName = data.testClassName;
                var testMethodName = data.testMethodName;

                // Set the page title - must use document. as we do not have an HtmlDocument object
                document.title = testClassName+'.'+testMethodName+' \u2022 Proctor \u2022 Assistant \u2022 Framework';

                var proctor = new Proctor('electron', true);

                var proctorEvents = [
                    //'Proctor.startedRunningTests',
                    //'Proctor.startedRunningTest',
                    'Proctor.startedRunningTestMethod',
                    'Proctor.finishedRunningTestMethod',
                    //'Proctor.finishedRunningTest',
                    'Proctor.finishedRunningTests',
                ];

                proctorEvents.each(function(proctorEventIndex, proctorEvent) {
                    proctor.on(proctorEvent, function(event) {
                        Electron.ipcRenderer.send('testBrowserWindow.report', {
                            status: proctorEvent,
                            data: event.data,
                            testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
                        });
                    });
                });

                //app.log('Testing below');
                proctor.getAndRunTestMethod(testClassFilePath, testClassName, testMethodName);
            }
            // close
            else if(command == 'close') {
                Electron.remote.getCurrentWindow().close();
            }
            // reset
            else if(command == 'reset') {
                document.location.reload(true);
            }
            // openDeveloperTools
            else if(command == 'openDeveloperTools') {
                Electron.remote.getCurrentWindow().openDevTools();
            }
            // show
            else if(command == 'show') {
                Electron.remote.getCurrentWindow().show();
            }
        });

        // Report we are ready
        Electron.ipcRenderer.send('testBrowserWindow.report', {
            status: 'readyForCommand',
            testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
        });
	}

	runTestMethod(testMethod) {
		//Console.standardLog('runTestMethod', testMethod);

		this.testMethod = testMethod;

		// Update the status
		this.status = 'runningTest';

		// Command the testBrowserWindow to run the test method
        Electron.ipcRenderer.send('electronMainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'runTestMethod', {
            testClassFilePath: this.testMethod.class.file.path,
            testClassName: this.testMethod.class.name,
            testMethodName: this.testMethod.name,
        });
	}

	openDeveloperTools() {
		//Console.standardWarn('openDeveloperTools');
		Electron.ipcRenderer.send('electronMainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'openDeveloperTools', {});
	}

	show() {
		//Console.standardWarn('TestBrowserWindow show');
		Electron.ipcRenderer.send('electronMainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'show', {});
	}

	retire() {
		//Console.standardWarn('TestBrowserWindow retire');
		Electron.ipcRenderer.send('electronMainBrowserWindow.commandTestBrowserWindow', this.uniqueIdentifier, 'close', {});

		super.retire();
	}
	
}

// Export
export default TestBrowserWindow;

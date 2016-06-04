// Dependencies
var ViewController = Framework.require('system/web-interface/controllers/ViewController.js');
var Proctor = Framework.require('system/test/Proctor.js');
var Electron = Node.require('electron');

// Class
var MainViewController = ViewController.extend({

    electronManager: null,

	construct: function(electronManager) {
        this.electronManager = electronManager;

        // Set the testBrowserWindowUniqueIdentifier
        var testBrowserWindowUniqueIdentifier = window.location.hash.replace('#', '');
        //Console.log('testBrowserWindowUniqueIdentifier', testBrowserWindowUniqueIdentifier);

        // Handle commands from the mainBrowserWindow
        Electron.ipcRenderer.on('mainBrowserWindow.commandTestBrowserWindow', function(eventFromIpcMain, command, data) {
            Console.standardLog(command, data);

            // runTestMethod
            if(command == 'runTestMethod') {
                var testClassFilePath = data.testClassFilePath;
                var testClassName = data.testClassName;
                var testMethodName = data.testMethodName;

                // Set the page title
                document.title = testClassName+'.'+testMethodName+' \u2022 Proctor \u2022 Framework';

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

                Console.log('Testing below');
                proctor.getAndRunTests(testClassFilePath, testClassName, testMethodName);
                //proctor.getAndRunTests();
            }
            // close
            else if(command == 'close') {
                Electron.remote.getCurrentWindow().close();
            }
            // reset
            else if(command == 'reset') {
                document.location.reload(true);
            }
        });

        // Report we are ready
        Electron.ipcRenderer.send('testBrowserWindow.report', {
            status: 'readyForCommand',
            testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
        });
	},

});

// Export
module.exports = MainViewController;
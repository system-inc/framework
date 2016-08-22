// Dependencies
var ViewController = Framework.require('system/web-interface/view-controllers/ViewController.js');
var Proctor = Framework.require('system/test/Proctor.js');
var Electron = Node.require('electron');

// Class
var MainViewController = ViewController.extend({

    electronManager: null,

	construct: function(electronManager) {
        this.electronManager = electronManager;

        // Set the testBrowserWindowUniqueIdentifier - must use window. as we do not have an HtmlDocument object
        var testBrowserWindowUniqueIdentifier = window.location.hash.replace('#', '');
        //Console.log('testBrowserWindowUniqueIdentifier', testBrowserWindowUniqueIdentifier);

        // Handle commands from the mainBrowserWindow
        Electron.ipcRenderer.on('mainBrowserWindow.commandTestBrowserWindow', function(eventFromIpcMain, command, data) {
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

                //Console.log('Testing below');
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
	},

});

// Export
module.exports = MainViewController;
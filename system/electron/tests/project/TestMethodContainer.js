// Dependencies (global)
Framework = require('../../../../Framework.js');

// Class (global)
Project = new Framework(__dirname);

// Dependencies
var Electron = Node.require('electron');

// Set the testBrowserWindowUniqueIdentifier
var testBrowserWindowUniqueIdentifier = window.location.hash.replace('#', '');

// Report when the web contents finish loading
Electron.remote.getCurrentWebContents().on('did-finish-load', function(event) {
	Electron.ipcRenderer.send('testBrowserWindow.report', {
		status: 'webContentsDidFinishLoadingReadyForCommand',
		testBrowserWindowUniqueIdentifier: testBrowserWindowUniqueIdentifier,
	});
});

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

		var Proctor = Framework.require('system/test/Proctor.js');
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
		//proctor.getAndRunTests(testClassFilePath, testClassName, testMethodName);
		proctor.getAndRunTests();
	}
	// close
	else if(command == 'close') {
		Electron.remote.getCurrentWindow().close();
	}
});

// Initialize
//Project.initialize();

// Export
module.exports = Project;
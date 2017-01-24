// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

import Proctor from 'framework/system/test/Proctor.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import ButtonView from 'framework/system/interface/graphical/views/buttons/ButtonView.js';
import TableView from 'framework/system/interface/graphical/views/tables/TableView.js';

// Class
class TestsActivityViewController extends ViewController {

	tests = null;
	testsFormView = null;
	
    testBrowserWindows = {};
    testBrowserWindowPool = null;

    previousTestMethodIndex = null;
    currentTestMethodIndex = null;
    nextTestMethodIndex = null;

	constructor() {
		super();

		this.view = new View();

        // Form
		this.createTestsFormView();

        // Test browser window pool
        this.testBrowserWindowPool = new TestBrowserWindowPool();

        // Listen to reports from Application
        //Electron.ipcRenderer.on('Application.report', function() {
        //    this.handleApplicationReport.apply(this, arguments);
        //}.bind(this));

        // Listen for reports from testBrowserWindows
        //Electron.ipcRenderer.on('testBrowserWindow.report', function() {
        //    this.handleTestBrowserWindowReport.apply(this, arguments);
        //}.bind(this));
	}

	async getTests() {
		// Get all possible tests: Proctor.getTests(path, filePattern, methodPattern)
        //var tests = await Proctor.getTests();
        //var tests = await Proctor.getTests(null, 'SingleLine');
        var tests = await Proctor.getTests(null, 'String');
        console.log('tests', tests);

        return tests;
	}

	async createTestsFormView() {
        var tests = await this.getTests();

        // Form
        var testsFormView = new FormView({
            submitButtonView: {
                content: 'Run Tests',
            },
        });

        // Summary
        var summary = new TextView(tests.methods.length+' test methods in '+tests.classes.length+' tests');
        testsFormView.append(summary);
        
        // Table
        var tableView = new TableView();
        tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        // Add each test
        tests.methods.each(function(testMethodIndex, testMethod) {
            // Status
            testMethod.statusText = 'Not Started';

            // Button
            testMethod.runButton = new ButtonView('Run');
            testMethod.runButton.on('input.press', function(event) {
                this.runTestMethod(testMethod);
            }.bind(this));

            // Add the row
            tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusText, testMethod.runButton);
        }.bind(this));

        // Submit event listener
        testsFormView.on('form.submit', function(event) {
            this.runTestMethods();
        }.bind(this));

        // Add the table to the form
        testsFormView.append(tableView);

        // Add the form to the view
        this.view.append(testsFormView);
    }

    async runTestMethod(testMethod) {
        console.info('run test', testMethod);

         // Get a test browser window from the pool
        var testBrowserWindow = await this.testBrowserWindowPool.getReusable();
        console.log('runTestMethod testBrowserWindow', testBrowserWindow.uniqueIdentifier, testBrowserWindow);

        // Run the test method in the test browser window
        testBrowserWindow.runTestMethod(testMethod);
    }

    async runTestMethods() {
        console.info('run test methods');

        // Reset the current test method index
        this.currentTestMethodIndex = null;

        this.runNextTestMethod();
    }

    runNextTestMethod() {
        // Start case
        if(this.currentTestMethodIndex === null) {
            this.currentTestMethodIndex = -1;
            this.currentTestMethodIndex = 0;
            this.nextTestMethodIndex = 1;
        }
        else {
            this.previousTestMethodIndex++;
            this.currentTestMethodIndex++;
            this.nextTestMethodIndex++;
        }

        var currentTestMethod = this.tests.methods[this.currentTestMethodIndex];

        var runNextTestMethodResult = false;

        if(currentTestMethod) {
            currentTestMethod.callback = function() {
                this.runNextTestMethod();
            }.bind(this);

            runNextTestMethodResult = this.runTestMethod(currentTestMethod);
        }

        return runNextTestMethodResult;
    }

    handleApplicationReport(event, data) {
        console.log('handleApplicationReport', data);

        var status = data.status;

        // A test browser window has been closed
        if(status == 'testBrowserWindowClosed') {
            var testBrowserWindowUniqueIdentifier = data.testBrowserWindowUniqueIdentifier;
            var testBrowserWindow = this.testBrowserWindowPool.getReusableByUniqueIdentifier(testBrowserWindowUniqueIdentifier);
            if(testBrowserWindow) {
                testBrowserWindow.status = 'closed';
                testBrowserWindow.retire();
            }
        }
    }

    handleTestBrowserWindowReport(event, data) {
        console.log('handleTestBrowserWindowReport', data);

        var status = data.status;
        var testBrowserWindowUniqueIdentifier = data.testBrowserWindowUniqueIdentifier;
        var testBrowserWindow = this.testBrowserWindowPool.getReusableByUniqueIdentifier(testBrowserWindowUniqueIdentifier);

        // The testBrowserWindow is created and ready for commands
        if(status == 'readyForCommand') {
            testBrowserWindow.status = status;
            testBrowserWindow.release();
            //console.log(testBrowserWindow);
        }
        //else if(status == 'Proctor.startedRunningTests') {
        //    testBrowserWindow.testMethod.statusSpan.setContent('startedRunningTests');
        //}
        //else if(status == 'Proctor.startedRunningTest') {
        //    testBrowserWindow.testMethod.statusSpan.setContent('startedRunningTest');
        //}
        else if(status == 'Proctor.startedRunningTestMethod') {
            testBrowserWindow.testMethod.statusSpan.setContent('Running...');
        }
        else if(status == 'Proctor.finishedRunningTestMethod') {
            testBrowserWindow.testMethod.statusSpan.setContent(data.data.status.toTitle());
        }
        //else if(status == 'Proctor.finishedRunningTest') {
        //    testBrowserWindow.testMethod.statusSpan.setContent('finishedRunningTest');
        //}
        else if(status == 'Proctor.finishedRunningTests') {
            //testBrowserWindow.testMethod.statusSpan.setContent('finishedRunningTests');

            if(testBrowserWindow.testMethod.callback) {
                testBrowserWindow.testMethod.callback.apply(this);
            }

            // If a test failed
            if(data.data.failedTestMethods.length) {
                //app.log('failed a test!');
                // Show the window and the dev tools
                testBrowserWindow.openDeveloperTools();
                testBrowserWindow.show();
            }
            // If no tests failed
            else {
                // Command the testBrowserWindow to close
                //Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', testBrowserWindowUniqueIdentifier, 'close', {});

                // Command the testBrowserWindow to reset
                Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', testBrowserWindowUniqueIdentifier, 'reset', {});
            }
        }
    }

}

// Export
export default TestsActivityViewController;

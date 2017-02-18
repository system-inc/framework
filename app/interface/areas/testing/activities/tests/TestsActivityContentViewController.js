// Dependencies
import Electron from 'electron';

import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

import Proctor from 'framework/system/test/Proctor.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import ButtonView from 'framework/system/interface/graphical/views/buttons/ButtonView.js';
import TableView from 'framework/system/interface/graphical/views/tables/TableView.js';

import TestBrowserWindowPool from 'interface/areas/testing/activities/tests/TestBrowserWindowPool.js';

// Class
class TestsActivityViewController extends ViewController {

	tests = null;
	testsFormView = null;
	
    testBrowserWindows = {};
    testBrowserWindowPool = new TestBrowserWindowPool().initialize();

    previousTestMethodIndex = null;
    currentTestMethodIndex = null;
    nextTestMethodIndex = null;

	constructor() {
		super();

		this.view = new View();

        // Form
		this.createTestsFormView();

        this.listen();
	}

    listen() {
        // Listen for reports from testBrowserWindows
        Electron.ipcRenderer.on('testBrowserWindow.report', function() {
            this.handleTestBrowserWindowReport(...arguments);
        }.bind(this));
    }

	async getTests() {
		// Get all possible tests: Proctor.getTests(path, filePattern, methodPattern)
        //var tests = await Proctor.getTests();
        //var tests = await Proctor.getTests(null, 'Database');
        var tests = await Proctor.getTests(null, 'SingleLine');
        //var tests = await Proctor.getTests(null, 'String');
        //var tests = await Proctor.getTests(null, 'interface');
        //var tests = await Proctor.getTests(null, 'Html');
        //var tests = await Proctor.getTests(null, 'Input');
        //console.log('tests', tests);

        return tests;
	}

	async createTestsFormView() {
        this.tests = await this.getTests();

        // Form
        var testsFormView = new FormView({
            submitButtonView: {
                content: 'Run Tests',
            },
        });

        // Summary
        var summary = new TextView(this.tests.methods.length+' test methods in '+this.tests.classes.length+' tests');
        testsFormView.append(summary);

        var status = new TextView('Pool status');
        testsFormView.append(status);
        
        // Table
        var tableView = new TableView();
        tableView.setColumns(['Class', 'Method', 'Status', '', '']);
        
        // Add each test
        this.tests.methods.each(function(testMethodIndex, testMethod) {
            // Status
            testMethod.statusText = 'Not Started';

            // Show
            testMethod.showButton = new ButtonView('Show');
            testMethod.showButton.on('input.press', function(event) {
                this.runTestMethod(testMethod, true);
            }.bind(this));

            // Run
            testMethod.runButton = new ButtonView('Run');
            testMethod.runButton.on('input.press', function(event) {
                this.runTestMethod(testMethod);
            }.bind(this));

            // Add the row
            testMethod.tableRowView = tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusText, testMethod.showButton, testMethod.runButton);
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

    async runTestMethod(testMethod, show = false) {
        //console.info('run test', testMethod);

        testMethod.tableRowView.getColumnCellView('Status').setContent('Initializing...');

         // Get a test browser window from the pool
        var testBrowserWindow = await this.testBrowserWindowPool.getReusable();
        //console.log('runTestMethod testBrowserWindow', testBrowserWindow.uniqueIdentifier, testBrowserWindow);

        // Show the browser window immediately with developer tools open and do not reset when finished running tests
        if(show) {
            testBrowserWindow.show();
            testBrowserWindow.openDeveloperTools();
            testBrowserWindow.resetWhenFinishedRunningTests = false;
        }

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

    handleTestBrowserWindowReport(event, data) {
        //console.log('handleTestBrowserWindowReport', data);

        var status = data.status;
        //console.log('status', status);
        var testBrowserWindowUniqueIdentifier = data.testBrowserWindowUniqueIdentifier;
        //console.log('testBrowserWindowUniqueIdentifier', testBrowserWindowUniqueIdentifier);
        var testBrowserWindow = this.testBrowserWindowPool.getReusableByUniqueIdentifier(testBrowserWindowUniqueIdentifier);
        //console.log('testBrowserWindow', testBrowserWindow);

        // The testBrowserWindow is created and ready for commands
        if(status == 'readyForCommand') {
            testBrowserWindow.status = status;
            testBrowserWindow.release();
            //console.log(testBrowserWindow);
        }
        // The testBrowserWindow has been closed
        else if(status == 'testBrowserWindowClosed') {
            //console.log('testBrowserWindowClosed');
            if(testBrowserWindow) {
                testBrowserWindow.status = 'closed';
                testBrowserWindow.retire();
            }
        }
        //else if(status == 'Proctor.startedRunningTests') {
        //    testBrowserWindow.testMethod.statusSpan.setContent('startedRunningTests');
        //}
        //else if(status == 'Proctor.startedRunningTest') {
        //    testBrowserWindow.testMethod.statusSpan.setContent('startedRunningTest');
        //}
        else if(status == 'Proctor.startedRunningTestMethod') {
            //console.info('testBrowserWindow.testMethod', testBrowserWindow.testMethod);
            testBrowserWindow.testMethod.tableRowView.getColumnCellView('Status').setContent('Running...');
        }
        else if(status == 'Proctor.finishedRunningTestMethod') {
            testBrowserWindow.testMethod.tableRowView.getColumnCellView('Status').setContent(data.data.status.toTitle());
        }
        //else if(status == 'Proctor.finishedRunningTest') {
        //    testBrowserWindow.testMethod.statusSpan.setContent('finishedRunningTest');
        //}
        else if(status == 'Proctor.finishedRunningTests') {
            //testBrowserWindow.testMethod.tableRowView.getColumnCellView('Status').setContent('Finished running tests...');

            if(testBrowserWindow.testMethod.callback) {
                testBrowserWindow.testMethod.callback.apply(this);
            }

            // If a test was skipped
            if(data.data.skippedTestMethods.length) {
                testBrowserWindow.testMethod.tableRowView.getColumnCellView('Status').setContent('Skipped');
            }

            // If a test failed
            if(data.data.failedTestMethods.length) {
                //app.log('failed a test!');
                // Show the window and the dev tools
                testBrowserWindow.openDeveloperTools();
                testBrowserWindow.show();
            }
            // If no tests failed and we want to reset when finished running tests
            else if(testBrowserWindow.resetWhenFinishedRunningTests) {
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

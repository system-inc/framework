// Dependencies
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import View from 'framework/system/interface/graphical/views/View.js';

import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

import Proctor from 'framework/system/test/Proctor.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import ListView from 'framework/system/interface/graphical/views/lists/ListView.js';
import ButtonView from 'framework/system/interface/graphical/views/buttons/ButtonView.js';
import TableView from 'framework/system/interface/graphical/views/tables/TableView.js';

import TestGraphicalInterfaceProxyPool from 'interface/areas/testing/activities/tests/TestGraphicalInterfaceProxyPool.js';

// Class
class TestsActivityViewController extends ViewController {

	tests = null;
	testsFormView = null;
	
    testGraphicalInterfaceProxies = {};
    testGraphicalInterfaceProxyPool = new TestGraphicalInterfaceProxyPool().initialize();

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
        // Listen for reports from testGraphicalInterfaceProxies
        //Electron.ipcRenderer.on('testGraphicalInterface.report', function() {
        //    this.handleTestGraphicalInterfaceReport(...arguments);
        //}.bind(this));
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
        tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        // Add each test
        this.tests.methods.each(function(testMethodIndex, testMethod) {
            // Status
            testMethod.statusText = 'Not Started';

            var actionListView = new ListView();
            actionListView.setDirection('horizontal');

            // Action - Run
            testMethod.runButton = new ButtonView('Run');
            testMethod.runButton.on('input.press', function(event) {
                this.runTestMethod(testMethod);
            }.bind(this));
            actionListView.addItem(testMethod.runButton);

            // Action - Show
            testMethod.showButton = new ButtonView('Show');
            testMethod.showButton.on('input.press', function(event) {
                this.runTestMethod(testMethod, true);
            }.bind(this));
            actionListView.addItem(testMethod.showButton).setStyle({
                marginLeft: '.25em',
            });

            // Add the row
            testMethod.tableRowView = tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusText, actionListView);
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
        var testGraphicalInterface = await this.testGraphicalInterfaceProxyPool.getReusable();
        //console.log('runTestMethod testGraphicalInterface', testGraphicalInterface.uniqueIdentifier, testGraphicalInterface);

        // Show the browser window immediately with developer tools open and do not reset when finished running tests
        if(show) {
            testGraphicalInterface.show();
            testGraphicalInterface.openDeveloperTools();
            testGraphicalInterface.resetWhenFinishedRunningTests = false;
        }

        // Run the test method in the test browser window
        testGraphicalInterface.runTestMethod(testMethod);
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

    handleTestGraphicalInterfaceReport(event, data) {
        //console.log('handleTestGraphicalInterfaceReport', data);

        var status = data.status;
        //console.log('status', status);
        var testGraphicalInterfaceUniqueIdentifier = data.testGraphicalInterfaceUniqueIdentifier;
        //console.log('testGraphicalInterfaceUniqueIdentifier', testGraphicalInterfaceUniqueIdentifier);
        var testGraphicalInterface = this.testGraphicalInterfaceProxyPool.getReusableByUniqueIdentifier(testGraphicalInterfaceUniqueIdentifier);
        //console.log('testGraphicalInterface', testGraphicalInterface);

        // The testGraphicalInterface is created and ready for commands
        if(status == 'readyForCommand') {
            testGraphicalInterface.status = status;
            testGraphicalInterface.release();
            //console.log(testGraphicalInterface);
        }
        // The testGraphicalInterface has been closed
        else if(status == 'testGraphicalInterfaceClosed') {
            //console.log('testGraphicalInterfaceClosed');
            if(testGraphicalInterface) {
                testGraphicalInterface.status = 'closed';
                testGraphicalInterface.retire();
            }
        }
        //else if(status == 'Proctor.startedRunningTests') {
        //    testGraphicalInterface.testMethod.statusSpan.setContent('startedRunningTests');
        //}
        //else if(status == 'Proctor.startedRunningTest') {
        //    testGraphicalInterface.testMethod.statusSpan.setContent('startedRunningTest');
        //}
        else if(status == 'Proctor.startedRunningTestMethod') {
            //console.info('testGraphicalInterface.testMethod', testGraphicalInterface.testMethod);
            testGraphicalInterface.testMethod.tableRowView.getColumnCellView('Status').setContent('Running...');
        }
        else if(status == 'Proctor.finishedRunningTestMethod') {
            testGraphicalInterface.testMethod.tableRowView.getColumnCellView('Status').setContent(data.data.status.toTitle());
        }
        //else if(status == 'Proctor.finishedRunningTest') {
        //    testGraphicalInterface.testMethod.statusSpan.setContent('finishedRunningTest');
        //}
        else if(status == 'Proctor.finishedRunningTests') {
            //testGraphicalInterface.testMethod.tableRowView.getColumnCellView('Status').setContent('Finished running tests...');

            if(testGraphicalInterface.testMethod.callback) {
                testGraphicalInterface.testMethod.callback.apply(this);
            }

            // If a test was skipped
            if(data.data.skippedTestMethods.length) {
                testGraphicalInterface.testMethod.tableRowView.getColumnCellView('Status').setContent('Skipped');
            }

            // If a test failed
            if(data.data.failedTestMethods.length) {
                //app.log('failed a test!');
                // Show the window and the dev tools
                testGraphicalInterface.openDeveloperTools();
                testGraphicalInterface.show();
            }
            // If no tests failed and we want to reset when finished running tests
            else if(testGraphicalInterface.resetWhenFinishedRunningTests) {
                // Command the testGraphicalInterface to close
                //Electron.ipcRenderer.send('mainGraphicalInterface.commandTestGraphicalInterface', testGraphicalInterfaceUniqueIdentifier, 'close', {});

                // Command the testGraphicalInterface to reset
                Electron.ipcRenderer.send('mainGraphicalInterface.commandTestGraphicalInterface', testGraphicalInterfaceUniqueIdentifier, 'reset', {});
            }
        }
    }

}

// Export
export default TestsActivityViewController;

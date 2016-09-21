// Dependencies
var Electron = Node.require('electron');
var Proctor = Framework.require('system/test/Proctor.js');
var ViewController = Framework.require('system/web-interface/view-controllers/ViewController.js');
var HeaderView = Framework.require('system/web-interface/views/text/HeaderView.js');
var ParagraphView = Framework.require('system/web-interface/views/text/ParagraphView.js');
var TextView = Framework.require('system/web-interface/views/text/TextView.js');
var FormView = Framework.require('system/web-interface/views/forms/FormView.js');
var OptionFormFieldView = Framework.require('system/web-interface/views/forms/fields/options/OptionFormFieldView.js');
var SingleLineTextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js');
var SingleLineTextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/single-line/SingleLineTextFormControlView.js');
var TableView = Framework.require('system/web-interface/views/tables/TableView.js');
var ButtonView = Framework.require('system/web-interface/views/buttons/ButtonView.js');
var TestBrowserWindowPool = Project.require('proctor/browser-windows/TestBrowserWindowPool.js');

// Class
var MainViewController = ViewController.extend({

    electronManager: null,

    subviews: {
        testsFormView: null,
    },

    tests: null,
    testBrowserWindows: {},

    testBrowserWindowPool: null,

    previousTestMethodIndex: null,
    currentTestMethodIndex: null,
    nextTestMethodIndex: null,

	construct: function(electronManager) {
        this.super();

        this.electronManager = electronManager;

        this.testBrowserWindowPool = new TestBrowserWindowPool();

        // Listen to reports from Application
        Electron.ipcRenderer.on('Application.report', function() {
            this.handleApplicationReport.apply(this, arguments);
        }.bind(this));

        // Listen for reports from testBrowserWindows
        Electron.ipcRenderer.on('testBrowserWindow.report', function() {
            this.handleTestBrowserWindowReport.apply(this, arguments);
        }.bind(this));
	},

    createViewContainer: function() {
        this.super();

        this.viewContainer.addStyleSheet('../../system/web-interface/themes/reset/style-sheets/reset.css');
        this.viewContainer.addStyleSheet('../../system/web-interface/themes/framework/style-sheets/framework.css');
        this.viewContainer.addStyleSheet('views/style-sheets/style-sheet.css');
    },

    createSubviews: function*() {
        // Header
        this.view.append(new HeaderView('Proctor'));

        // Tests
        this.createTestsFormView();
    },

    createTestsFormView: function*() {
        // Get all possible tests: Proctor.getTests(path, filePattern, methodPattern)
        //this.tests = yield Proctor.getTests();
        this.tests = yield Proctor.getTests(null, 'SingleLine');
        //Console.standardLog(this.tests);

        // Create a FormView
        this.subviews.testsFormView = new FormView({
            submitButtonView: {
                content: 'Run Tests',
            },
        });

        this.subviews.testsFormView.on('form.submit', function(event) {
            this.runTestMethods();
        }.bind(this));

        var summary = new ParagraphView(this.tests.methods.length+' test methods in '+this.tests.classes.length+' tests');
        this.subviews.testsFormView.append(summary);
        
        // Table for the tests
        var tableView = new TableView();
        tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        this.tests.methods.each(function(testMethodIndex, testMethod) {
            testMethod.runButton = new ButtonView('Run');
            testMethod.runButton.on('input.press', function(event) {
                this.runTestMethod(testMethod);
            }.bind(this));

            testMethod.statusSpan = Html.span('Not Started');

            tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusSpan, testMethod.runButton);
        }.bind(this));

        this.subviews.testsFormView.append(tableView);

        //app.log(tableView.getData());

        this.view.append(this.subviews.testsFormView);
    },

    runTestMethod: function*(testMethod) {
        // Get a test browser window from the pool
        var testBrowserWindow = yield this.testBrowserWindowPool.getReusable();

        //Console.standardLog('MainViewController.runTestMethod testBrowserWindow', testBrowserWindow.uniqueIdentifier, testBrowserWindow);

        // Run the test method in the test browser window
        testBrowserWindow.runTestMethod(testMethod);
    },

    runTestMethods: function() {
        // Reset the current test method index
        this.currentTestMethodIndex = null;

        this.runNextTestMethod();
    },

    runNextTestMethod: function() {
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
    },

    handleApplicationReport: function(event, data) {
        //console.log('handleApplicationReport', data);

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
    },

    handleTestBrowserWindowReport: function(event, data) {
        //Console.standardLog('handleTestBrowserWindowReport', data);

        var status = data.status;
        var testBrowserWindowUniqueIdentifier = data.testBrowserWindowUniqueIdentifier;
        var testBrowserWindow = this.testBrowserWindowPool.getReusableByUniqueIdentifier(testBrowserWindowUniqueIdentifier);

        // The testBrowserWindow is created and ready for commands
        if(status == 'readyForCommand') {
            testBrowserWindow.status = status;
            testBrowserWindow.release();
            //console.standardLog(testBrowserWindow);
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
    },

});

// Export
module.exports = MainViewController;
// Dependencies
var ViewController = Framework.require('system/web-interface/controllers/ViewController.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var FormView = Framework.require('system/web-interface/views/forms/FormView.js');
var OptionFormFieldView = Framework.require('system/web-interface/views/forms/fields/options/OptionFormFieldView.js');
var SingleLineTextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js');
var SingleLineTextFormControlView = Framework.require('system/web-interface/views/forms/controls/text/single-line/SingleLineTextFormControlView.js');
var Proctor = Framework.require('system/test/Proctor.js');
var TableView = Framework.require('system/web-interface/views/tables/TableView.js');
var ButtonView = Framework.require('system/web-interface/views/buttons/ButtonView.js');
var Electron = Node.require('electron');

// Class
var MainViewController = ViewController.extend({

    electronManager: null,

    tests: null,
    testBrowserWindows: {},

    previousTestMethodIndex: null,
    currentTestMethodIndex: null,
    nextTestMethodIndex: null,

	construct: function(electronManager) {
        this.electronManager = electronManager;

        // Listen to reports from Application
        Electron.ipcRenderer.on('Application.report', function() {
            this.handleApplicationReport.apply(this, arguments);
        }.bind(this));

        // Listen for reports from testBrowserWindows
        Electron.ipcRenderer.on('testBrowserWindow.report', function() {
            this.handleTestBrowserWindowReport.apply(this, arguments);
        }.bind(this));

        this.layoutViews();
	},

    layoutViews: function*() {
        // Create an HtmlDocument
        this.htmlDocument = this.createHtmlDocument();

        // Set this ViewController's view to be the body of the HtmlDocument
        this.view = this.htmlDocument.body;

        // Header
        this.view.append(Html.h1('Proctor'));

        // Get all possible tests
        this.tests = yield Proctor.getTests();
        //this.tests = yield Proctor.getTests(null, 'electron');
        //Console.standardLog(tests);

        // Run tests form
        this.view.append(this.createRunTestsFormView());

        // Mount the HtmlDocument to the DOM
        this.htmlDocument.mountToDom();
    },

    createHtmlDocument: function() {
        // Create the HTML document
        var htmlDocument = new HtmlDocument();
        
        // Default style sheet
        htmlDocument.addStyleSheet('../../../web-interface/themes/reset/style-sheets/reset.css');
        htmlDocument.addStyleSheet('../../../web-interface/themes/framework/style-sheets/framework.css');
        htmlDocument.addStyleSheet('views/style-sheets/style-sheet.css');

        return htmlDocument;
    },

    createRunTestsFormView: function() {
        // Create a FormView
        var runTestsFormView = new FormView({
            submitButton: {
                content: 'Run Tests',
            },
        });

        runTestsFormView.on('form.submit', function(event) {
            this.runTestMethods();
        }.bind(this));

        // Checkbox
        var optionFormFieldView = new OptionFormFieldView('runTestsInOrder', {
            label: 'Run Tests in Order',
        });
        runTestsFormView.addFormFieldView(optionFormFieldView);

        var summary = Html.p(this.tests.methods.length+' test methods in '+this.tests.classes.length+' tests');
        runTestsFormView.append(summary);
        
        // Table for the tests
        var tableView = new TableView();
        tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        this.tests.methods.each(function(testMethodIndex, testMethod) {
            testMethod.runButton = new ButtonView('Run');
            testMethod.runButton.on('interact', function(event) {
                this.createTestBrowserWindow(testMethod);
            }.bind(this));

            testMethod.statusSpan = Html.span('Not Started');

            tableView.addRow(testMethod.class.name, testMethod.name, testMethod.statusSpan, testMethod.runButton);
        }.bind(this));

        runTestsFormView.append(tableView);

        //Console.log(tableView.getData());

        return runTestsFormView;
    },

    runTestMethods: function() {
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

        this.createTestBrowserWindow(currentTestMethod);

        currentTestMethod.callback = function() {
            this.runNextTestMethod();
        }.bind(this);
    },

    createTestBrowserWindow: function(testMethod) {
        var testBrowserWindowUniqueIdentifier = String.uniqueIdentifier();

        this.testBrowserWindows[testBrowserWindowUniqueIdentifier] = {
            status: 'waitingForApplicationToCreateTestBrowserWindow',
            uniqueIdentifier: testBrowserWindowUniqueIdentifier,
            testMethod: testMethod,
        };
        //Console.standardLog('this.testBrowserWindows', this.testBrowserWindows);

        // Send a message to the main process to create a testBrowserWindow
        Electron.ipcRenderer.send('mainBrowserWindow.createTestBrowserWindow', testBrowserWindowUniqueIdentifier);
    },

    handleApplicationReport: function(event, data) {
        //console.log('handleApplicationReport', data);

        var status = data.status;

        // A test browser window has been closed
        if(status == 'testBrowserWindowClosed') {
            var testBrowserWindowUniqueIdentifier = data.testBrowserWindowUniqueIdentifier;
            this.testBrowserWindows[testBrowserWindowUniqueIdentifier].status = 'closed';
        }
    },

    handleTestBrowserWindowReport: function(event, data) {
        Console.standardLog('handleTestBrowserWindowReport', data);

        var status = data.status;
        var testBrowserWindowUniqueIdentifier = data.testBrowserWindowUniqueIdentifier;
        var testBrowserWindow = this.testBrowserWindows[testBrowserWindowUniqueIdentifier];

        // The testBrowserWindow is created and ready for commands
        if(status == 'webContentsDidFinishLoadingReadyForCommand') {
            testBrowserWindow.status = status;

            testBrowserWindow.testMethod.statusSpan.setContent('Test Window Ready')

            // Command the testBrowserWindow to run the test method
            Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', testBrowserWindowUniqueIdentifier, 'runTestMethod', {
                testClassFilePath: testBrowserWindow.testMethod.class.file.path,
                testClassName: testBrowserWindow.testMethod.class.name,
                testMethodName: testBrowserWindow.testMethod.name,
            });
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

            // Command the testBrowserWindow to close
            Electron.ipcRenderer.send('mainBrowserWindow.commandTestBrowserWindow', testBrowserWindowUniqueIdentifier, 'close', {});
        }
    },

});

// Export
module.exports = MainViewController;
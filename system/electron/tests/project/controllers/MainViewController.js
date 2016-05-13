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

// Class
var MainViewController = ViewController.extend({

    // Electron
    electron: null,

	construct: function(electron) {
        this.electron = electron;
        this.layoutViews();
	},

    layoutViews: function*() {
        // Create an HtmlDocument
        this.htmlDocument = this.createHtmlDocument();

        // Set this ViewController's view to be the body of the HtmlDocument
        this.view = this.htmlDocument.body;

        this.view.append(Html.h1('Framework Test Proctor'));

        // Run tests form
        var runTestsFormView = yield this.createRunTestsFormView();
        this.view.append(runTestsFormView);

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

    createRunTestsFormView: function*() {
        // Create a FormView
        var runTestsFormView = new FormView({
            submitButton: {
                content: 'Run Tests',
            },
        });

        // Checkbox
        var optionFormFieldView = new OptionFormFieldView('runTestsInOrder', {
            label: 'Run Tests in Order',
        });
        runTestsFormView.addFormFieldView(optionFormFieldView);

        runTestsFormView.on('form.submit', function(event) {
            Console.log('Form submit!', event);
        }.bind(this));
        
        // Table for the tests
        var tableView = new TableView();
        tableView.setColumns(['Class', 'Method', 'Status', '']);
        
        // Get all possible tests
        //var tests = yield Proctor.getTests();
        var tests = yield Proctor.getTests(null, 'electron');
        //Console.standardLog(tests);

        tests.methods.each(function(testMethodIndex, testMethod) {
            var runTestMethodButton = new ButtonView('Run');
            Console.error('This .on call doesnt seem tobe adding the event listener');
            runTestMethodButton.on('interact', function(event) {
                Console.log('button pressed!');
                Console.standardLog(event);
            });
            Console.standardLog(runTestMethodButton);

            tableView.addRow(testMethod.class.name, testMethod.name, 'Not Started', runTestMethodButton);
        });

        runTestsFormView.append(tableView);

        //Console.log(tableView.getData());

        var summary = Html.p(tests.methods.length+' test methods in '+tests.classes.length+' tests');
        runTestsFormView.append(summary);

        return runTestsFormView;
    },

    runTests: function() {
        console.log('running tests');
    },

});

// Export
module.exports = MainViewController;
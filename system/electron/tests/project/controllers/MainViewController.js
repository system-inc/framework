// Dependencies
var ViewController = Framework.require('system/web-interface/controllers/ViewController.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var FormView = Framework.require('system/web-interface/views/forms/FormView.js');
var OptionFormFieldView = Framework.require('system/web-interface/views/forms/fields/options/OptionFormFieldView.js');
var SingleLineTextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js');
var Proctor = Framework.require('system/test/Proctor.js');
var TableView = Framework.require('system/web-interface/views/tables/TableView.js');

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

        // Run tests form
        //var runTestsFormView = yield this.createRunTestsFormView();
        //this.view.append(runTestsFormView);

        // This breaks things
        var table = Html.table();
        var tr = Html.tr();
        var td = Html.td('Hi');
        tr.append(td);
        table.append(tr);
        this.view.append(table);

        // Mount the HtmlDocument to the DOM
        this.htmlDocument.mountToDom();
    },

    createHtmlDocument: function() {
        // Create the HTML document
        var htmlDocument = new HtmlDocument();
        
        // Default style sheet
        htmlDocument.addStyleSheet('views/style-sheets/style.css');

        return htmlDocument;
    },

    createRunTestsFormView: function*() {
        // Create a FormView
        var runTestsFormView = new FormView({
            submitButton: {
                content: 'Run Tests',
            },
        });

        runTestsFormView.on('form.submit', function(event) {
            Console.log('Form submit!', event);
        }.bind(this));

        // Checkbox
        var optionFormFieldView = new OptionFormFieldView('runTestsInOrder', {
            label: 'Run Tests in Order',
        });
        runTestsFormView.addFormFieldView(optionFormFieldView);
        
        // Table for the tests
        var tableView = new TableView();
        //tableView.setColumns(['Test Class', 'Test Method', 'Test Status', '']);
        
        // Get all possible tests
        var tests = yield Proctor.getTests();
        //Console.standardLog(tests);

        tests.each(function(testName, test) {
            test.methods.each(function(testMethodIndex, testMethod) {
                //tableView.addRow(test.name, testMethod, 'Pending', Html.button('Run'));
                //tableView.append(Html.tr(testName));
            });
        });

        

        //tableView.append('<tr><td>Test</td><td>Test</td></tr>');

        runTestsFormView.append(tableView);

        //runTestsFormView.addCheckboxFormField('userIdentifier', {
        //    label: 'Tests:',
        //    enterSubmits: true,
        //    validation: {
        //        required: true,
        //    },
        //});

        return runTestsFormView;
    },

    runTests: function() {
        console.log('running tests');
    },

});

// Export
module.exports = MainViewController;
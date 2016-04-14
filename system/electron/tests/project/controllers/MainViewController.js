// Dependencies
var ViewController = Framework.require('system/web-interface/controllers/ViewController.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var HtmlElement = Framework.require('system/html/HtmlElement.js');
var FormView = Framework.require('system/web-interface/views/FormView.js');

// Class
var MainViewController = ViewController.extend({

    // Electron
    electron: null,

	construct: function(electron) {
        this.electron = electron;
        this.layoutViews();
	},

    layoutViews: function() {
        // Create an HtmlDocument
        this.htmlDocument = this.createHtmlDocument();

        // Set this ViewController's view to be the body of the HtmlDocument
        this.view = this.htmlDocument.body;

        // Run tests form
        this.view.append(this.createRunTestsFormView());

        // Test table

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

    createRunTestsFormView: function() {
        // Create a FormView
        var runTestsFormView = new FormView({
            submitButton: {
                content: 'Run Tests',
            },
        });

        runTestsFormView.on('form.submit', function(event) {
            Console.log('Form submit!', event);
        }.bind(this));

        // Add a text input
        runTestsFormView.addCheckboxFormField('userIdentifier', {
            label: 'Tests:',
            enterSubmits: true,
            validation: {
                required: true,
            },
        });

        return runTestsFormView;
    },

    runTests: function() {
        console.log('running tests');
    },

});

// Export
module.exports = MainViewController;
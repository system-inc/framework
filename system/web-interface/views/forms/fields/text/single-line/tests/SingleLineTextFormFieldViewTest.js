// Dependencies
var ElectronTest = Framework.require('system/electron/tests/ElectronTest.js');
var Assert = Framework.require('system/test/Assert.js');
var HtmlDocument = Framework.require('system/html/HtmlDocument.js');
var Html = Framework.require('system/html/Html.js');
var ElectronManager = null;
var HtmlDocumentEvent = Framework.require('system/html/events/html-document/HtmlDocumentEvent.js');
var HtmlEvent = Framework.require('system/html/events/html-event/HtmlEvent.js');
var FormView = Framework.require('system/web-interface/views/forms/FormView.js');
var SingleLineTextFormFieldView = Framework.require('system/web-interface/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js');

// Class
var SingleLineTextFormFieldViewTest = ElectronTest.extend({

	before: function*() {
    	// Initialize the ElectronManager here as to not throw an exception when electron is not present
    	ElectronManager = Framework.require('system/electron/ElectronManager.js');
	},

	testEnterSubmits: function*() {
    	// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Create the form
        var formView = new FormView();
        var singleLineTextFormFieldView = new SingleLineTextFormFieldView('singleLineText', {
            label: 'Pressing enter on this input should submit it:',
            enterSubmits: true,
        });
        formView.addFormFieldView(singleLineTextFormFieldView);
        htmlDocument.body.append(formView);

        var capturedEventFormSubmit = null;

        formView.on('form.submit', function(event) {
            Console.standardInfo(event.identifier, event);
            capturedEventFormSubmit = event;
        });

        // Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click the input field
        yield ElectronManager.clickHtmlElement(singleLineTextFormFieldView);

        // Press the enter key to emit the input.key.enter event
        //singleLineTextFormFieldView.emit('input.key.enter');
        yield ElectronManager.pressKey('Enter');

        // Make sure the form submitted event occured
        Assert.true(Class.isInstance(capturedEventFormSubmit, HtmlEvent), '"form.submit" events emit on "input.key.enter"');

    	//throw new Error('Throwing error to display browser window.');
	},

});

// Export
module.exports = SingleLineTextFormFieldViewTest;
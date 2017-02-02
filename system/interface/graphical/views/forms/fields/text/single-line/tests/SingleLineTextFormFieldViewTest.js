// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';
import ViewController from 'framework/system/interface/graphical/view-controllers/ViewController.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import SingleLineTextFormFieldView from 'framework/system/interface/graphical/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js';
var ElectronManager = null;

// Class
class SingleLineTextFormFieldViewTest extends ElectronTest {

	async before() {
        // Initialize the ElectronManager here as to not throw an exception when electron is not present
        ElectronManager = require('framework/system/electron/ElectronManager.js');
    }

	async testEnterSubmits() {
        throw new Error('Throwing error to display browser window.');
        
        //// Create a new ViewController
        //var viewController = new ViewController();

        //// Create the form
        //var formView = new FormView();

        //// Capture the submit event
        //var capturedEventFormSubmit = null;
        //formView.on('form.submit', function(event) {
        //    event.stop();
        //    console.info(event.identifier, event);
        //    capturedEventFormSubmit = event;
        //});

        //// Create the single line text form field view
        //var singleLineTextFormFieldView = new SingleLineTextFormFieldView('singleLineText', {
        //    label: 'Pressing enter on this input should submit it:',
        //    enterSubmits: true, // Enter submits
        //});
        //formView.addFormFieldView(singleLineTextFormFieldView);

        //// Add the form to the view controller's view
        //viewController.view.append(formView);

        //viewController.initialize();

        //throw new Error('Throwing error to display browser window.');

        //// Click the input field
        //yield ElectronManager.clickView(singleLineTextFormFieldView.formControlView);

        //// Type something into the field
        //yield ElectronManager.pressKey('A');

        //// Press enter
        //yield ElectronManager.pressKey('Enter');

        //// Make sure the form submitted event occured
        //Assert.true(Class.isInstance(capturedEventFormSubmit, ViewEvent), '"form.submit" events emit on "input.key.enter"');

        //throw new Error('Throwing error to display browser window.');



    	//// Create an HtmlDocument
     //   var htmlDocument = new HtmlDocument();

     //   // Create the form
     //   var formView = new FormView();
     //   var singleLineTextFormFieldView = new SingleLineTextFormFieldView('singleLineText', {
     //       label: 'Pressing enter on this input should submit it:',
     //       enterSubmits: true,
     //   });
     //   formView.addFormFieldView(singleLineTextFormFieldView);
     //   htmlDocument.body.append(formView);

     //   var capturedEventFormSubmit = null;

     //   singleLineTextFormFieldView.formControlView.on('input.press', function(event) {
     //       console.info(event.identifier, event);
     //   });

     //   formView.on('form.submit', function(event) {
     //       console.info(event.identifier, event);
     //       capturedEventFormSubmit = event;
     //   });

     //   // Mount the HtmlDocument to the DOM
     //   htmlDocument.mountToDom();

     //   // Click the input field
     //   yield ElectronManager.clickHtmlElement(singleLineTextFormFieldView.formControlView);

     //   // Type something into the field
     //   yield ElectronManager.pressKey('A');

     //   // Press enter
     //   yield ElectronManager.pressKey('Enter');

     //   // Make sure the form submitted event occured
     //   Assert.true(Class.isInstance(capturedEventFormSubmit, HtmlEvent), '"form.submit" events emit on "input.key.enter"');

    	////throw new Error('Throwing error to display browser window.');
	}

}

// Export
export default SingleLineTextFormFieldViewTest;

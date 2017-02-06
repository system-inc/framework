// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import SingleLineTextFormFieldView from 'framework/system/interface/graphical/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js';

// Class
class SingleLineTextFormFieldViewTest extends ElectronTest {

	async testEnterSubmits() {
        //console.log('testEnterSubmits');
        //throw new Error('Throwing error to display browser window.');

        // Create a view controller
        var viewController = new ViewController();

        // Create the form
        var formView = new FormView();
        console.info('formView', formView);

        // Capture the submit event
        var capturedEventFormSubmit = null;
        formView.on('form.submit', function(event) {
            event.stop();
            console.info(event.identifier, event);
            capturedEventFormSubmit = event;
        });

        // Create the single line text form field view
        var singleLineTextFormFieldView = new SingleLineTextFormFieldView('singleLineText', {
            label: 'Pressing enter on this input should submit it:',
            enterSubmits: true, // Enter submits
        });
        formView.addFormFieldView(singleLineTextFormFieldView);
        console.info('singleLineTextFormFieldView', singleLineTextFormFieldView);

        // Have the graphical interface manager create a graphical interface with a view controller
        app.interfaces.graphicalInterfaceManager.create(viewController);

        // Add the form to the view controller's view
        viewController.view.append(formView);
        viewController.initialize();

        // Click the input field
        //await ElectronManager.clickView(singleLineTextFormFieldView.formControlView);

        // Type something into the field
        //await ElectronManager.pressKey('A');

        // Press enter
        //await ElectronManager.pressKey('Enter');

        // Make sure the form submitted event occured
        //Assert.true(Class.isInstance(capturedEventFormSubmit, ViewEvent), '"form.submit" events emit on "input.key.enter"');
	}

}

// Export
export default SingleLineTextFormFieldViewTest;

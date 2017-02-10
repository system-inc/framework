// Dependencies
import ElectronTest from 'framework/system/interface/graphical/electron/tests/ElectronTest.js';
import Assert from 'framework/system/test/Assert.js';

import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import SingleLineTextFormFieldView from 'framework/system/interface/graphical/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js';
import ViewEvent from 'framework/system/interface/graphical/views/events/ViewEvent.js';

// Class
class SingleLineTextFormFieldViewTest extends ElectronTest {

	async testEnterSubmits() {
        //console.log('testEnterSubmits');
        //throw new Error('Throwing error to display browser window.');

        // Create the form
        var formView = new FormView();
        console.info('formView', formView);

        // Capture the submit event
        var capturedEventFormSubmit = null;
        formView.on('form.submit', function(event) {
            event.stop();
            console.info('captured!', event.identifier, event);
            capturedEventFormSubmit = event;
        });

        // Create the single line text form field view
        var singleLineTextFormFieldView = new SingleLineTextFormFieldView('singleLineText', {
            label: 'Pressing enter on this input should submit it:',
            enterSubmits: true, // Enter submits
        });
        formView.addFormFieldView(singleLineTextFormFieldView);
        console.info('singleLineTextFormFieldView', singleLineTextFormFieldView);
        //singleLineTextFormFieldView.on('form.submit', function(event) {
        //    console.info('captured on single line!', event.identifier, event);
        //    formView.emit('form.submit');
        //});

        // Render the view
        this.render(formView);

        // Click the input field
        await this.graphicalInterface.adapter.clickView(singleLineTextFormFieldView.formControlView);

        // Type something into the field
        await this.graphicalInterface.adapter.pressKey('A');

        // Press enter
        await this.graphicalInterface.adapter.pressKey('\u000d');

        // Make sure the form submitted event occured
        Assert.true(Class.isInstance(capturedEventFormSubmit, ViewEvent), '"form.submit" events emit on "input.key.enter"');

        throw new Error('Throwing error to display browser window.');
	}

}

// Export
export default SingleLineTextFormFieldViewTest;

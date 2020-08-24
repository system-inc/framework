// Dependencies
import { ElectronHtmlTest } from '@framework/modules/electron/interface/graphical/web/html/tests/ElectronHtmlTest.js';
import { Assert } from '@framework/system/test/Assert.js';

import { HtmlDocument } from '@framework/system/interface/graphical/web/html/HtmlDocument.js';
import { Html } from '@framework/system/interface/graphical/web/html/Html.js';
import { FormEvent } from '@framework/system/interface/graphical/web/html/events/html-element/FormEvent.js';

// Class
class FormEventTest extends ElectronHtmlTest {

	async testFormEvent() {
		// Create an HtmlDocument
        var htmlDocument = new HtmlDocument();

        // Create a form
        var formElement = Html.form({
        	onsubmit: 'return false;', // So the document doesn't change location on form submit
        	style: 'margin: 30px;',
        });
        
        var inputElement = Html.input();
        formElement.append(inputElement);

        var submitButton = Html.input({
        	type: 'submit',
        });
        formElement.append(submitButton);

		// Append the form to the HtmlDocument body
		htmlDocument.body.append(formElement);

		// Set a variable to capture the event
		var capturedFormControlChangeEvent = null;
		var capturedFormControlChangeEventCount = 0;
		var capturedFormSubmitEvent = null;

		// Add an event listener to the textarea to capture the event when triggered
		formElement.on('form.*', function(event) {
			console.info(event.identifier, event);

			if(event.identifier == 'form.control.change') {
				capturedFormControlChangeEventCount++;
				capturedFormControlChangeEvent = event;
			}
			else if(event.identifier == 'form.submit') {
				capturedFormSubmitEvent = event;
			}
		});

		// Mount the HtmlDocument to the DOM
        htmlDocument.mountToDom();

        // Click into the input
		await this.inputPressHtmlNode(inputElement);

		// Type a key
		await this.inputKeyPress('A');

		// Click the body to blur off of the inputElement which will cause the change event to be emitted
		await this.inputPressHtmlNode(htmlDocument.body);

		// Click the submit button
		await this.inputPressHtmlNode(submitButton);

		// form.control.change should have fired
		Assert.true(Class.isInstance(capturedFormControlChangeEvent, FormEvent), '"form.control.change" events are instances of FormEvent');

		// form.control.change should have fired once
		Assert.strictEqual(capturedFormControlChangeEventCount, 1, '"form.control.change" events fire the correct amount of time');
		
		// the emitter for form.control.change should be the inputElement
		Assert.strictEqual(capturedFormControlChangeEvent.emitter, inputElement, 'emitter property on "form.control.change" event is correct');

		// form.submit should have fired
		Assert.true(Class.isInstance(capturedFormSubmitEvent, FormEvent), '"form.submit" events are instances of FormEvent');

		// the emitter for the form.submit should be the form (even though it was triggered by the submit button)
		Assert.strictEqual(capturedFormSubmitEvent.emitter, formElement, 'emitter property on "form.submit" event is correct');

		//throw new Error('Throwing error to display browser window.');
	}

}

// Export
export { FormEventTest };

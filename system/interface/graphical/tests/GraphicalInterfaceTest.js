// Dependencies
import ElectronGraphicalInterfaceTest from 'framework/modules/electron/interface/graphical/tests/ElectronGraphicalInterfaceTest.js';
import Assert from 'framework/system/test/Assert.js';

import View from 'framework/system/interface/graphical/views/View.js';
import FormView from 'framework/system/interface/graphical/views/forms/FormView.js';
import SingleLineTextFormFieldView from 'framework/system/interface/graphical/views/forms/fields/text/single-line/SingleLineTextFormFieldView.js';

// Class
class GraphicalInterfaceTest extends ElectronGraphicalInterfaceTest {

	async testGraphicalInterface() {
        // Add event listener to key presses on the graphical interface

        // Capture the event
        var capturedEvent = null;
        app.interfaces.graphical.on('input.key.a', function(event) {
            console.info('captured!', event.identifier, event);
            capturedEvent = event;
        });

        // Render the view
        //await this.render(formView);
        await this.render(new View());

        // Type something into the field
        await this.inputKeyPress('a');

        // Make sure the form submitted event occured
        Assert.true(capturedEvent !== null, 'GraphicalInterface can listen to input key events');
	}
	
}

// Export
export default GraphicalInterfaceTest;

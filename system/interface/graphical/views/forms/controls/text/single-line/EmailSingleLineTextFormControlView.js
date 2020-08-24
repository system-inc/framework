// Dependencies
import { SingleLineTextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/single-line/SingleLineTextFormControlView.js';

// Class
class EmailSingleLineTextFormControlView extends SingleLineTextFormControlView {

    constructor() {
    	super(...arguments);

    	this.setAttribute('type', 'email');
    }

}

// Export
export { EmailSingleLineTextFormControlView };

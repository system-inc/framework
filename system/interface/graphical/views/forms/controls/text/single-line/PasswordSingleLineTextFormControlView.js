// Dependencies
import { SingleLineTextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/single-line/SingleLineTextFormControlView.js';

// Class
class PasswordSingleLineTextFormControlView extends SingleLineTextFormControlView {

    constructor() {
    	super(...arguments);

    	this.setAttribute({
    		type: 'password',
    	});
    }

}

// Export
export { PasswordSingleLineTextFormControlView };

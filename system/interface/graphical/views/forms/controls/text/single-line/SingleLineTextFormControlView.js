// Dependencies
import { TextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/TextFormControlView.js';

// Class
class SingleLineTextFormControlView extends TextFormControlView {

    constructor() {
    	super(...arguments);

    	this.setAttribute('type', 'text');
    }

    getWebViewAdapterSettings() {
		return {
			tag: 'input',
		};
	}

}

// Export
export { SingleLineTextFormControlView };

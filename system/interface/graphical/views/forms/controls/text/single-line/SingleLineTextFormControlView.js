// Dependencies
import TextFormControlView from 'framework/system/interface/graphical/views/forms/controls/text/TextFormControlView.js';

// Class
class SingleLineTextFormControlView extends TextFormControlView {

    attributes = {
        type: 'text',
        class: 'control text singleLine',
    };

    constructor(options, settings) {
    	super(...arguments);
    }

    getWebViewAdapterSettings() {
		return {
			tag: 'input',
		};
	}

}

// Export
export default SingleLineTextFormControlView;

// Dependencies
import TextFormControlView from 'system/interface/graphical/web/views/forms/controls/text/TextFormControlView.js';

// Class
class SingleLineTextFormControlView extends TextFormControlView {

    attributes = {
        type: 'text',
        class: 'control text singleLine',
    };

    constructor(options, settings, tag = 'input') {
    	super(...arguments);
    }

}

// Export
export default SingleLineTextFormControlView;

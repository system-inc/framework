// Dependencies
import TextFormControlView from './../../../../../../../system/web-interface/views/forms/controls/text/TextFormControlView.js';

// Class
class SingleLineTextFormControlView extends TextFormControlView {

    tag = 'input';

    attributes = {
        type: 'text',
        class: 'control text singleLine',
    };

}

// Export
export default SingleLineTextFormControlView;

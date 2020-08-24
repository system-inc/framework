// Dependencies
import { FormControlView } from '@framework/system/interface/graphical/views/forms/controls/FormControlView.js';

// Class
class OptionFormControlView extends FormControlView {

    attributes: {
        type: 'checkbox',
    }

    getWebViewAdapterSettings() {
        return {
            tag: 'input',
        };
    }

}

// Export
export { OptionFormControlView };

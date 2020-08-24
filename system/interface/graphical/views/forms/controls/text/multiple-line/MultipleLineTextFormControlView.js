// Dependencies
import { TextFormControlView } from '@framework/system/interface/graphical/views/forms/controls/text/TextFormControlView.js';

// Class
class MultipleLineTextFormControlView extends TextFormControlView {

    settings = this.settings.mergeDefaults({
        wordWrap: false,
    });

    constructor(settings) {
        super(settings);

		// Word wrap
		if(this.settings.get('wordWrap')) {
			//app.log('Enabling word wrap.');
			this.enableWordWrap();
		}
    }

    enableWordWrap() {
    	this.setAttribute('wrap', 'soft');
        this.setStyle({
            overflowX: null,
            overflowWrap: null,
            whiteSpace: 'pre-wrap',
        });
    }

    disableWordWrap() {
    	this.setAttribute('wrap', 'off');
        this.setStyle({
            overflowX: 'scroll',
            overflowWrap: 'normal',
            whiteSpace: 'pre',
        });
    }

    getWebViewAdapterSettings() {
        return {
            tag: 'textarea',
        };
    }

}

// Export
export { MultipleLineTextFormControlView };

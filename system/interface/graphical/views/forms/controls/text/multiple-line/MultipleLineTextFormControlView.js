// Dependencies
import TextFormControlView from 'framework/system/interface/graphical/views/forms/controls/text/TextFormControlView.js';

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
    }

    disableWordWrap() {
    	this.setAttribute('wrap', 'off');
    }

    getWebViewAdapterSettings() {
        return {
            tag: 'textarea',
        };
    }

}

// Export
export default MultipleLineTextFormControlView;

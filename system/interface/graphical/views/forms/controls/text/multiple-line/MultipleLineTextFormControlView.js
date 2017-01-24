// Dependencies
import TextFormControlView from 'framework/system/interface/graphical/views/forms/controls/text/TextFormControlView.js';

// Class
class MultipleLineTextFormControlView extends TextFormControlView {

    constructor(settings) {
        super(settings);

        this.settings.setDefaults({
        	wordWrap: false,
		});

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

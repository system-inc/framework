// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class FormLabelView extends TextView {

	relatedFormControlView = null;

	constructor(text, relatedFormControlView = null) {
		super(text);

		this.relatedFormControlView = relatedFormControlView;
	}

	setRelatedFormControlView(relatedFormControlView) {
		this.relatedFormControlView = relatedFormControlView;
	}

	getWebViewAdapterSettings() {
		var webViewAdapterSettings = {
			tag: 'label',
		};

		if(this.relatedFormControlView) {
			webViewAdapterSettings.attributes = {
				for: this.relatedFormControlView.getAttribute('id'),
			};
		}

		return webViewAdapterSettings;
	}

}

// Export
export default FormLabelView;

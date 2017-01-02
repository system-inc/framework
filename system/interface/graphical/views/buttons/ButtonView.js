// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ButtonView extends TextView {

	getWebViewAdapterSettings() {
		return {
			tag: 'a',
		};
	}

}

// Export
export default ButtonView;

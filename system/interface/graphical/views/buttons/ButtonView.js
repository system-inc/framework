// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ButtonView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'a',
		};
	}

}

// Export
export default ButtonView;

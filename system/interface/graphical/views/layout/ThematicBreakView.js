// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ThematicBreakView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'hr',
		};
	}

}

// Export
export default ThematicBreakView;

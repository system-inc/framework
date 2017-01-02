// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class TableHeadingView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'thead',
		};
	}

}

// Export
export default TableHeadingView;

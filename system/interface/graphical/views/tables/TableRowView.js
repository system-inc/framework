// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class TableRowView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'tr',
		};
	}

}

// Export
export default TableRowView;

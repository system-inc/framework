// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class TableCellView extends TextView {

	getWebViewAdapterSettings() {
		return {
			tag: 'td',
		};
	}

}

// Export
export default TableCellView;

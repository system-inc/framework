// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class TableHeadingCellView extends TextView {

	getWebViewAdapterSettings() {
		return {
			tag: 'th',
		};
	}

}

// Export
export default TableHeadingCellView;

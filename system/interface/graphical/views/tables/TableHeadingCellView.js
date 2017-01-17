// Dependencies
import TableCellView from 'framework/system/interface/graphical/views/tables/TableCellView.js';

// Class
class TableHeadingCellView extends TableCellView {

	getWebViewAdapterSettings() {
		return {
			tag: 'th',
		};
	}

}

// Export
export default TableHeadingCellView;

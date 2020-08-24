// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class TableRowView extends View {

	getColumnCellView(columnIdentifier) {
		var columnIndex = null;

		var tableView = this.parent;

		tableView.columns.each(function(currentColumnIndex, currentColumnIdentifier) {
			if(columnIdentifier == currentColumnIdentifier) {
				columnIndex = currentColumnIndex;
			}
		});

		return this.children[columnIndex];
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'tr',
		};
	}

}

// Export
export { TableRowView };

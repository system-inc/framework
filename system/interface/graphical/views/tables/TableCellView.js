// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class TableCellView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'td',
		};
	}

}

// Export
export { TableCellView };

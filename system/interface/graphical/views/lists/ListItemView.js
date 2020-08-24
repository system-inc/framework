// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class ListItemView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'li',
		};
	}

}

// Export
export { ListItemView };

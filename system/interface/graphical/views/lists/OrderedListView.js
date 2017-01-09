// Dependencies
import ListView from 'framework/system/interface/graphical/views/lists/ListView.js';

// Class
class OrderedListView extends ListView {

	getWebViewAdapterSettings() {
		return {
			tag: 'ol',
		};
	}

}

// Export
export default OrderedListView;

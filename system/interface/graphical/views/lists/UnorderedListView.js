// Dependencies
import ListView from 'framework/system/interface/graphical/views/lists/ListView.js';

// Class
class UnorderedListView extends ListView {

	getWebViewAdapterSettings() {
		return {
			tag: 'ul',
		};
	}

}

// Export
export default UnorderedListView;

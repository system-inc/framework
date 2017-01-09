// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ListItemView extends TextView {

	getWebViewAdapterSettings() {
		return {
			tag: 'li',
		};
	}

}

// Export
export default ListItemView;

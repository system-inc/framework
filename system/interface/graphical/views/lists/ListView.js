// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import ListItemView from 'framework/system/interface/graphical/views/lists/ListItemView.js';

// Class
class ListView extends View {

	addItem(listItemViewOptions) {
		var listItemView = new ListItemView(listItemViewOptions);
		
		this.append(listItemView);

		return listItemView;
	}

	setDirection(direction) {
		if(direction == 'horizontal') {
			this.addClass('horizontal');
		}
		else {
			this.removeClass('horizontal');
		}
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'ul',
		};
	}

}

// Export
export default ListView;

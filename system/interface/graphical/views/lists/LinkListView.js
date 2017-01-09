// Dependencies
import ListView from 'framework/system/interface/graphical/views/lists/ListView.js';
import LinkListItemView from 'framework/system/interface/graphical/views/lists/LinkListItemView.js';

// Class
class LinkListView extends ListView {

	addItem(linkContent, linkDestination, linkListItemViewOptions) {
		var linkListItemView = new LinkListItemView(linkContent, linkDestination, linkListItemViewOptions);

		this.append(linkListItemView);

		return linkListItemView;
	}

}

// Export
export default LinkListView;

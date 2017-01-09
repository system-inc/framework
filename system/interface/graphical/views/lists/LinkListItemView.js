// Dependencies
import ListItemView from 'framework/system/interface/graphical/views/lists/ListItemView.js';
import LinkView from 'framework/system/interface/graphical/views/links/LinkView.js';

// Class
class LinkListItemView extends ListItemView {

	constructor(linkContent, linkUrl, linkViewOptions, listItemViewOptions) {
		super(listItemViewOptions);

		var linkView = new LinkView(linkContent, linkUrl, linkViewOptions);
		
		this.append(linkView);
	}

}

// Export
export default LinkListItemView;

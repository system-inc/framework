// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import LinkListView from 'framework/system/interface/graphical/views/lists/LinkListView.js';

// Class
class ActivityNavigationView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '1',
			overflow: 'auto',
			//background: 'blue',
			padding: '.5rem 0',
			color: '#333',
			background: '#F9F9F9',
		});

		var linkListView = new LinkListView();
		linkListView.setStyle({
			//fontSize: '.9em',
		});
		linkListView.addItem('Tests');
		//linkListView.addItem('Coverage');
		//linkListView.addItem('History');
		//linkListView.addItem('Regressions');
		this.append(linkListView);
	}

}

// Export
export default ActivityNavigationView;

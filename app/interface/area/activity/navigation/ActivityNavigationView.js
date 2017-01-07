// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ActivityNavigationView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '1',
			//background: 'blue',
			overflow: 'scroll',
			padding: '.75rem',
			color: '#333',
			background: '#F9F9F9',
		});

		this.append(new TextView('Tests'));
	}

}

// Export
export default ActivityNavigationView;

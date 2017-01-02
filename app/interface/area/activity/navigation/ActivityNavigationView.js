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
			paddingTop: '.75rem',
			paddingLeft: '.75rem',
			paddingRight: '.75rem',
		});

		this.append(new TextView('Tests'));
	}

}

// Export
export default ActivityNavigationView;

// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

// Class
class ActivityHeaderView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 64px',
			display: 'flex',
			alignItems: 'center',
			boxSizing: 'content-box',
			borderBottom: '1px solid #CCC',
			padding: '0 1rem',
		});

		var heading = new HeadingView('Tests', 2);
		heading.setStyle({
			fontSize: '1.25em',
			fontWeight: '300',
			margin: 0,
		});
		this.append(heading);
	}

}

// Export
export default ActivityHeaderView;

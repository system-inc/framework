// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

// Class
class AreaNavigationView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 64px',
			display: 'flex',
			alignItems: 'center',
			borderBottom: '1px solid #CCC',
			paddingLeft: '.75rem',
			paddingRight: '.75rem',
			color: '#333',
			background: '#F9F9F9',
		});

		var heading = new HeadingView('Testing', 2);
		heading.setStyle({
			fontSize: '1.25em',
			fontWeight: '300',
			margin: 0,
		});
		this.append(heading);
	}

}

// Export
export default AreaNavigationView;

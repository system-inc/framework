// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

// Class
class HeaderView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 1 48px',
			display: 'flex',
			alignItems: 'center',
			//borderBottom: '1px solid #CCC',
			background: '#666',
			color: '#FFF',
			paddingLeft: '.75rem',
			paddingRight: '.75rem',
		});

		var heading = new HeadingView('Framework');
		heading.setStyle({
			fontWeight: '100',
			margin: 0,
		});		
		this.append(heading);
	}

}

// Export
export default HeaderView;

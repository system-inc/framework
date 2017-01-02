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
			borderBottom: '1px solid #CCC',
		});

		var heading = new HeadingView('Framework');
		heading.setStyle({
			fontWeight: '100',
			marginLeft: '.75rem',
		});		
		this.append(heading);
	}

}

// Export
export default HeaderView;

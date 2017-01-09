// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';
import LinkView from 'framework/system/interface/graphical/views/links/LinkView.js';

// Class
class AreaNavigationView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 64px',
			display: 'flex',
			alignItems: 'center',
			borderBottom: '1px solid #CCC',
			padding: '0 1rem',
			color: '#333',
			background: '#F9F9F9',
		});

		var linkView = new LinkView('Testing');
		linkView.addClass('icon caret');

		var heading = new HeadingView(linkView, 2);
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

// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

// Class
class HeaderView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 1 48px',
			borderBottom: '1px solid #CCC',
		});

		this.append(new HeadingView('Framework'));
	}

}

// Export
export default HeaderView;

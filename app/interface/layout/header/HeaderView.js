// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';

// Class
class HeaderView extends View {

	constructor() {
		super();

		this.append(new HeadingView('HeaderView'));
	}

}

// Export
export default HeaderView;

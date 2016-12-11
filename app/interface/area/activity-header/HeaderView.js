// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import HeadingView from 'framework/system/interface/graphical/views/text/HeadingView.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class HeaderView extends View {

	constructor() {
		super();

		this.addClass('header');
		this.append(new HeadingView('Framework'));
	}

}

// Export
export default HeaderView;

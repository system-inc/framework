// Dependencies
import View from 'system/interface/graphical/views/View.js';
import HeadingView from 'system/interface/graphical/views/text/HeadingView.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';

// Class
class HeaderView extends View {

	initialize() {
		super.initialize();

		this.append(new HeadingView('Framework'));
		this.addClass('header');
	}

}

// Export
export default HeaderView;

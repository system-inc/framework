// Dependencies
import View from 'system/interface/graphical/views/View.js';
import HeadingView from 'system/interface/graphical/views/text/HeadingView.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';

// Class
class NavigationView extends View {

	constructor() {
		super();

		this.addClass('navigation');
		this.append(new HeadingView('Current Item', 2));
		this.append(new TextView('Proctor'));
	}

}

// Export
export default NavigationView;

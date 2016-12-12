// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class NavigationView extends View {

	constructor() {
		super();

		this.append(new TextView('AreaView'));
	}

}

// Export
export default NavigationView;

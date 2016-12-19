// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class BodyView extends View {

	constructor() {
		super();

		this.append(new TextView('BodyView'));
	}

}

// Export
export default BodyView;

// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class AreaNavigationView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 48px',
			borderBottom: '1px solid #CCC',
		});
		
		this.append(new TextView('Testing'));
	}

}

// Export
export default AreaNavigationView;

// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { TextView } from '@framework/system/interface/graphical/views/text/TextView.js';

// Class
class BodyNavigationView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 260px',
			order: '-1',
			display: 'flex',
			flexDirection: 'column',
			boxSizing: 'content-box',
			borderRight: '1px solid #CCC',
		});
	}

}

// Export
export { BodyNavigationView };

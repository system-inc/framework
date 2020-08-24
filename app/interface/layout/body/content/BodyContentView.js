// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { TextView } from '@framework/system/interface/graphical/views/text/TextView.js';

// Class
class BodyContentView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '1',
			display: 'flex',
			flexDirection: 'column',
		});
	}

}

// Export
export { BodyContentView };

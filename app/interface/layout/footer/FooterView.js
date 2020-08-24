// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { TextView } from '@framework/system/interface/graphical/views/text/TextView.js';

// Class
class FooterView extends View {

	constructor() {
		super();

		this.setStyle({
			display: 'flex',
			flex: '0 1 28px',
			borderTop: '1px solid #CCC',
		});
	}

}

// Export
export { FooterView };

// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class SvgView extends View {

	getWebViewAdapterSettings() {
		return {
			tag: 'svg',
			version: '1.1',
			xmlns: 'http://www.w3.org/2000/svg',
			'xmlns:xlink': 'http://www.w3.org/1999/xlink',
		};
	}

}

// Export
export { SvgView };

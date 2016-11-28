// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class TextView extends View {

	text = null;
	layout = 'block'; // 'block' or 'inline'

	constructor(text) {
		// View
		super();

		this.text = text;
	}

	getWebViewAdapterSettings() {
		return {
			tag: this.layout == 'block' ? 'p' : 'span',
		};
	}

}

// Export
export default TextView;

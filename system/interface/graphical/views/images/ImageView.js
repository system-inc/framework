// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ImageView extends View {

	constructor(url, alternateText = null) {
		super();

		this.setAttribute('src', url.toString());

		if(alternateText) {
			this.setAttribute('alt', alternateText);
		}
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'img',
		};
	}

}

// Export
export default ImageView;

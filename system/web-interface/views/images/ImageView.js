// Dependencies
import View from './../../../../system/web-interface/views/View.js';

// Class
class ImageView extends View {

	tag = 'img';

	attributes = {
		class: 'image',
	}

	construct(url, alternateText, settings) {
		this.super(...arguments);

		this.setAttribute('src', url);

		if(alternateText) {
			this.setAttribute('alt', alternateText);	
		}
	}

}

// Export
export default ImageView;

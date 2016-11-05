// Dependencies
import View from 'system/interface/graphical/web/views/View.js';

// Class
class ImageView extends View {

	attributes = {
		class: 'image',
	}

	constructor(url, alternateText, settings, tag = 'img') {
		super(null, settings, tag);

		this.setAttribute('src', url);

		if(alternateText) {
			this.setAttribute('alt', alternateText);	
		}
	}

}

// Export
export default ImageView;

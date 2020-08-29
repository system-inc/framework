// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';
import { HeadingView } from '@framework/system/interface/graphical/views/text/HeadingView.js';

// Class
class CardView extends View {

    // Views
    imageView = null;
    titleView = null;
    titleDescriptorView = null;
    descriptionView = null;
    informationView = null;

    imageUrl = null;
    url = null;

    data = null;
    
	constructor(imageUrl, titleString, titleDescriptorString, titleDescriptorString, descriptionString, url) {
        super();

        // Set the background image
        this.setStyle({
            'background-image': 'url('+imageUrl+')',
        });

        // title view
        this.titleView = new HeadingView(titleString);
        this.append(this.titleView);
    }

}

// Export
export { CardView };

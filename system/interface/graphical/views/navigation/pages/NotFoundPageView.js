// Dependencies
import { PageView } from '@framework/system/interface/graphical/views/navigation/pages/PageView.js';
import { HeadingView } from '@framework/system/interface/graphical/views/text/HeadingView.js';
import { TextView } from '@framework/system/interface/graphical/views/text/TextView.js';

// Class
class NotFoundPageView extends PageView {

	locationString = 'this location';

	constructor() {
        super();
        
        this.append(new HeadingView('Not Found'));
        this.append(new TextView('The page at '+this.locationString+' was not found.'));
    }
    
}

// Export
export { NotFoundPageView };

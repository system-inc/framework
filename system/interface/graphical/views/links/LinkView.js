// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class LinkView extends TextView {

	constructor(childViewOrText, destination) {
		super(childViewOrText);

		if(destination) {
			this.setAttribute('href', destination);
		}
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'a',
		};
	}

}

// Export
export default LinkView;

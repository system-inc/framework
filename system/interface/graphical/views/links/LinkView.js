// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class LinkView extends View {

	destination = null;
	openInNewGraphicalInterface = false;

	constructor(childViewOrText, destination, openInNewGraphicalInterface = false) {
		super(childViewOrText);

		this.destination = destination;
		this.openInNewGraphicalInterface = openInNewGraphicalInterface;
	}

	getWebViewAdapterSettings() {
		return {
			tag: 'a',
			attributes: {
				'href': this.destination,
				'target': (this.openInNewGraphicalInterface ? '_blank' : null),
			},
		};
	}

}

// Export
export { LinkView };

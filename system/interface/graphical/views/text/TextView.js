// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class TextView extends View {

	text = null;
	layout = 'block'; // 'block' or 'inline'

	constructor(childViewOrText) {
		// View
		super();

		if(childViewOrText) {
			if(View.is(childViewOrText)) {
				this.append(childViewOrText);
			}
			else {
				this.text = childViewOrText;
			}
		}
	}

	setContent(childViewOrText) {
		// Empty the current content
		this.empty();

		if(childViewOrText) {
			// If the content is a view
			if(View.is(childViewOrText)) {
				// Append the new content
				this.append(childViewOrText);
			}
			// If the content is text
			else {
				this.text = childViewOrText;
				this.adapter.setContent(childViewOrText);
			}
		}

		return this;
	}

	getWebViewAdapterSettings() {
		return {
			tag: this.layout == 'block' ? 'p' : 'span',
		};
	}

	static is(value) {
		return Class.isInstance(value, TextView);
	}

}

// Export
export default TextView;

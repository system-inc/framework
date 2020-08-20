// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import PrimitiveView from 'framework/system/interface/graphical/views/PrimitiveView.js';

// Class
class TextView extends View {

	primitiveView = null; // A primitive view to store the text
	layout = 'block'; // 'block' (breaks text) or 'inline' (does not break text)

	constructor(text, layout = 'block') {
		super();

		// Use a primitive view to store the text
		this.primitiveView = new PrimitiveView(text);
		this.append(this.primitiveView);

		this.layout = layout;
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

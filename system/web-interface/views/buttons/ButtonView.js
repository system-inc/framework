// Dependencies
import View from './../../../../system/web-interface/views/View.js';

// Class
class ButtonView extends View {

	tag = 'a';

	attributes = {
		class: 'button',
	};

	construct(content, settings) {
		this.super(...arguments);
		this.settings.setDefaults({

		});

		this.append(content);
	}

}

// Export
export default ButtonView;

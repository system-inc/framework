// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';

// Class
class ButtonView extends View {

	tag = 'a';

	attributes = {
		class: 'button',
	};

	constructor(options, settings) {
		super(...arguments);

		this.settings.setDefaults({
		});

		this.append(options);
	}

}

// Export
export default ButtonView;

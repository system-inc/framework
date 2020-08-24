// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class NotificationView extends View {

	constructor() {
		super();

		this.setStyle({
			display: 'none',
		});
	}

	show(content, options) {
		this.setContent(content);

		if(options && options.duration) {
			Function.delay(options.duration, function() {
				this.hide();
			}.bind(this));
		}

		super.show();
	}

}

// Export
export { NotificationView };

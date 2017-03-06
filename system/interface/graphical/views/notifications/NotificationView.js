// Dependencies
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class NotificationView extends TextView {

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
export default NotificationView;

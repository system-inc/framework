// Dependencies
import TextView from 'system/interface/graphical/views/text/TextView.js';

// Class
class HeadingView extends TextView {

	// TextView
	layout = 'block';
	
	level = 1; // 1-infinity

	constructor(text, level = 1) {
		super(text);

		this.level = level;
	}

	getWebViewAdapterSettings() {
		var level = this.level;
		if(level > 6) {
			app.warn('Level must be 1 through 6.');
			level = 6;
		}

		return {
			tag: 'h'+level,
		};
	}

}

// Export
export default HeadingView;

// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ConsoleView extends View {

	constructor() {
		super();

		this.setStyle({
			//flex: 'auto auto auto',
			display: 'flex',
			alignItems: 'center',
		});

		var text = new TextView('Console');
		text.setStyle({
			margin: 0,
		});
		this.append(text);
	}

}

// Export
export default ConsoleView;

// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ActivityConsoleView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 100px',
			//order: '-1',
			display: 'flex',
			flexDirection: 'column',
			borderLeft: '1px solid #CCC',
		});

		var text = new TextView('Activity Console');
		//this.append(text);

		this.append(new View().addClass('icon close'));
	}

}

// Export
export default ActivityConsoleView;

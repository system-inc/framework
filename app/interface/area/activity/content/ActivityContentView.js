// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ActivityContentView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '1',
			//background: 'red',
			overflow: 'scroll',
		});

		//this.append(new TextView('ActivityContentView'+(String.random(10)+' ').repeat(500)));
		this.append(new TextView('Tests'));
	}

}

// Export
export default ActivityContentView;

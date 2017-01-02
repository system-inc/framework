// Dependencies
import View from 'framework/system/interface/graphical/views/View.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';

// Class
class ActivityHeaderView extends View {

	constructor() {
		super();

		this.setStyle({
			flex: '0 0 64px',
			display: 'flex',
			alignItems: 'center',
			borderBottom: '1px solid #CCC',
			paddingLeft: '.75rem',
			paddingRight: '.75rem',
		});

		var textView = new TextView('Tests');
		textView.setStyle({			
		});
		this.append(textView);
	}

}

// Export
export default ActivityHeaderView;

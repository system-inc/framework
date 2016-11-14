// Dependencies
import ViewAdapter from 'system/interface/graphical/views/adapters/ViewAdapter.js';
import HtmlElement from 'system/interface/graphical/web/html/HtmlElement.js';

// Class
class WebViewAdapter extends ViewAdapter {

	webView = null;

	constructor(view) {
		super(view);

		app.log('creating HtmlElement for view', this.view);
		this.webView = new HtmlElement('div', this.view.content);
	}

}

// Export
export default WebViewAdapter;

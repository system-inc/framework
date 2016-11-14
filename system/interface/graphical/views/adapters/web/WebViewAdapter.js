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

	listen() {
		this.webView.on('htmlNode.domUpdateExecuted', function(event) {
			this.view.emit('view.rendered', event);
		}.bind(this));

		this.webView.on('htmlNode.mountedToDom', function(event) {
			this.view.emit('view.initialized', event);
		}.bind(this));
	}

	append(view) {
		this.webView.append(view.adapter.webView);
	}

}

// Export
export default WebViewAdapter;

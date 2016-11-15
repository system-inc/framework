// Dependencies
import ViewAdapter from 'system/interface/graphical/views/adapters/ViewAdapter.js';
import TextView from 'system/interface/graphical/views/text/TextView.js';
import HtmlNode from 'system/interface/graphical/web/html/HtmlNode.js';
import HtmlElement from 'system/interface/graphical/web/html/HtmlElement.js';

// Class
class WebViewAdapter extends ViewAdapter {

	webView = null;

	constructor(view) {
		super(view);

		// Conditions for an HtmlNode instead of an HtmlElement
		if(
			TextView.is(this.view) && // It is a TextView
			this.view.layout == 'inline' && // That has an inline layout
			this.view.children.length == 0 // That has no children
		) {
			this.webView = new HtmlNode(this.view.text);
		}
		// Otherwise, use an HtmlElement
		else {
			var tag = this.view.getWebViewAdapterSettings().tag;
			this.webView = new HtmlElement(tag, this.view.text);
		}
	}

	listen() {
		this.webView.on('htmlNode.domUpdateExecuted', function(event) {
			this.view.emit('view.rendered', event);
		}.bind(this));

		this.webView.on('htmlNode.mountedToDom', function(event) {
			this.view.emit('view.initialized', event);
		}.bind(this));
	}

	append(childView) {
		this.webView.append(childView.adapter.webView);
	}

}

// Export
export default WebViewAdapter;

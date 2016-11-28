// Dependencies
import ViewAdapter from 'framework/system/interface/graphical/views/adapters/ViewAdapter.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';

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
			// TODO: and it has no style
		) {
			this.webView = new HtmlNode(this.view.text);
		}
		// Otherwise, use an HtmlElement
		else {
			var tag = this.view.getWebViewAdapterSettings().tag;
			this.webView = new HtmlElement(tag, this.view.text);
		}
	}

	synchronizeWithView() {
		console.log('synchronizeWithView');
		this.view.identifier = this.webView.nodeIdentifier;
		this.webView.attributes = this.view.attributes;
		this.webView.updateDom();
	}

	listen() {
		console.log('listening');

		this.webView.on('htmlNode.domUpdateExecuted', function(event) {
			this.view.emit('view.rendered', event);
		}.bind(this));

		this.webView.on('htmlNode.mountedToDom', function(event) {
			this.view.emit('view.initialized', event);
		}.bind(this));
	}

	append(childView) {
		return this.webView.append(childView.adapter.webView);
	}

	prepend(childView) {
		return this.webView.prepend(childView.adapter.webView);
	}

	addClass() {
		return this.webView.addClass(...arguments);
	}

	show() {
		return this.webView.show(...arguments);
	}

	hide() {
		return this.webView.hide(...arguments);
	}

	focus() {
		return this.webView.focus(...arguments);
	}

	select() {
		return this.webView.select(...arguments);
	}

	getSelectionText() {
		return this.webView.getSelectionText(...arguments);
	}

	press() {
		return this.webView.press(...arguments);
	}

}

// Export
export default WebViewAdapter;

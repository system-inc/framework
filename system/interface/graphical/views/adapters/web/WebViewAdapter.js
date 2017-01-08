// Dependencies
import ViewAdapter from 'framework/system/interface/graphical/views/adapters/ViewAdapter.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';

// Class
class WebViewAdapter extends ViewAdapter {

	createAdaptedView() {
		// Conditions for an HtmlNode instead of an HtmlElement
		if(
			TextView.is(this.view) && // It is a TextView
			this.view.layout == 'inline' && // That has an inline layout
			this.view.children.length == 0 // That has no children
			// TODO: and it has no style
		) {
			this.adaptedView = new HtmlNode(this.view.text);
		}
		// Otherwise, use an HtmlElement
		else {
			var tag = this.view.getWebViewAdapterSettings().tag;
			this.adaptedView = new HtmlElement(tag, this.view.text);
		}

		console.warn('need to hook into adaptedView\'s emit function to catch everything it emits and reemit from the View');
	}

	render() {
		super.render();
		this.adaptedView.updateDom();
	}

}

// Export
export default adaptedViewAdapter;

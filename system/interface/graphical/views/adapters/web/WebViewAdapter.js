// Dependencies
import ViewAdapter from 'framework/system/interface/graphical/views/adapters/ViewAdapter.js';
import TextView from 'framework/system/interface/graphical/views/text/TextView.js';
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';

// Class
class WebViewAdapter extends ViewAdapter {

	createAdaptedView() {
		var adaptedView = null;

		// Conditions for an HtmlNode instead of an HtmlElement
		if(
			TextView.is(this.view) && // It is a TextView
			this.view.layout == 'inline' && // That has an inline layout
			this.view.children.length == 0 // That has no children
		) {
			//console.warn('adapted view is a node not an element view:', this.view);
			adaptedView = new HtmlNode(this.view.text);
		}
		// Otherwise, use an HtmlElement
		else {
			var tag = this.view.getWebViewAdapterSettings().tag;
			adaptedView = new HtmlElement(tag, this.view.text); // Pass in text in case it exists which will become an HtmlNode
		}

		// Make the adapted views attributes use the view's attributes
		adaptedView.attributes = this.view.attributes;

		// When the adapted view is mounted to the DOM, update the view's identifier
		adaptedView.on('htmlNode.mountedToDom', function() {
			this.view.identifier = adaptedView.nodeIdentifier;
		}.bind(this));

		//console.warn('need to hook into adaptedView\'s emit function to catch everything it emits and reemit from the View');

		return adaptedView;
	}

	render() {
		if(this.adaptedView) {
			console.info('WebViewAdapter.render', this.view.adapter.adaptedView.tag, this.view);
			this.adaptedView.updateDom();	
		}
		else {
			//console.info('WebViewAdapter.render - skipped', this.view);
		}
	}

}

// Export
export default WebViewAdapter;

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
		adaptedView.once('htmlNode.mountedToDom', function() {
			this.view.identifier = adaptedView.nodeIdentifier;
		}.bind(this));

		//console.warn('need to hook into adaptedView\'s emit function to catch everything it emits and reemit from the View');

		return adaptedView;
	}

	get dimensions() {
		var adaptedViewDimensions = this.adaptedView.dimensions;
		var dimensions = adaptedViewDimensions;

		return dimensions;
	}

	get position() {
		//console.log('this.adaptedView', this.adaptedView);
		//return this.executeAdaptedViewMethod('position', arguments);

		var adaptedViewPosition = this.adaptedView.position;
		var position = {
			relativeToGraphicalInterface: adaptedViewPosition.relativeToDocument,
			relativeToGraphicalInterfaceViewport: adaptedViewPosition.relativeToDocumentViewport,
			relativeToDisplay: adaptedViewPosition.relativeToDisplay,
			relativeToAllDisplays: adaptedViewPosition.relativeToAllDisplays,
			relativeToPreviousAllDisplaysRelativePosition: adaptedViewPosition.relativeToPreviousAllDisplaysRelativePosition,
			relativeToRelativeAncestor: adaptedViewPosition.relativeToRelativeAncestor,
		};

		return position;
	}

}

// Export
export default WebViewAdapter;

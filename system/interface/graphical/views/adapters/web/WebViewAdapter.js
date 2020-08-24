// Dependencies
import { ViewAdapter } from '@framework/system/interface/graphical/views/adapters/ViewAdapter.js';
import { HtmlNode } from '@framework/system/interface/graphical/web/html/HtmlNode.js';
import { HtmlElement } from '@framework/system/interface/graphical/web/html/HtmlElement.js';

// Class
class WebViewAdapter extends ViewAdapter {

	createAdaptedView() {
		var adaptedView = null;

		// PrimitiveViews are adapted by HtmlNodes not HtmlElements
		if(Class.getClassNameFromInstance(this.view) == 'PrimitiveView') {
			//console.warn('adapted view is a node not an element view:', this.view);
			adaptedView = new HtmlNode(this.view.content);
		}
		// Otherwise, use an HtmlElement
		else {
			var webViewAdapterSettings = this.view.getWebViewAdapterSettings();

			// Get the tag from the web view adapter settings
			var tag = webViewAdapterSettings.tag;

			// Get the attributes from the web view adapter settings
			var attributes = webViewAdapterSettings.attributes ? webViewAdapterSettings.attributes : {};

			// Merge attributes from the view
			attributes = attributes.merge(this.view.attributes);

			// Create the adapted view which is an HtmlElement
			adaptedView = new HtmlElement(tag, attributes);
		}

		return adaptedView;
	}

	initializeAdaptedView(adaptedView) {
		super.initializeAdaptedView(adaptedView);

		// TODO: Rethink how to do this
		// This was originally here for setting form values
		// I commented it out because I think there is a better way to do this, maybe when the element is initialized in ViewAdapter.initializeAdaptedView
		// if(this.view.value) {
		// 	adaptedView.domNode.value = this.view.value;
		// }

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
export { WebViewAdapter };

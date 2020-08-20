// Dependencies
import ViewAdapter from 'framework/system/interface/graphical/views/adapters/ViewAdapter.js';
import HtmlNode from 'framework/system/interface/graphical/web/html/HtmlNode.js';
import HtmlElement from 'framework/system/interface/graphical/web/html/HtmlElement.js';

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

			var tag = webViewAdapterSettings.tag;
			var attributes = webViewAdapterSettings.attributes ? webViewAdapterSettings.attributes : null;
			adaptedView = new HtmlElement(tag);
		}

		// Initialize the adapted view
		adaptedView = this.initializeAdaptedView(adaptedView);

		//console.warn('need to hook into adaptedView\'s emit function to catch everything it emits and reemit from the View');

		return adaptedView;
	}

	initializeAdaptedView(adaptedView) {
		// When the adapted view is mounted to the DOM, update the view's identifier
		adaptedView.once('htmlNode.mountedToDom', function() {
			this.view.identifier = adaptedView.nodeIdentifier;

			// If the view has a value (is a form control)
			if(this.view.value) {
				adaptedView.domNode.value = this.view.value;
			}
		}.bind(this));

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

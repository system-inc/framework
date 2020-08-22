// Dependencies
import PropagatingEventEmitter from 'framework/system/event/PropagatingEventEmitter.js';
import ViewEvent from 'framework/system/interface/graphical/views/events/ViewEvent.js';
import XmlNode from 'framework/system/xml/XmlNode.js';

// Class
// Similar to HtmlNode, this is a view which has no attributes or children and can be used to display primitive text
class PrimitiveView extends PropagatingEventEmitter {

	// From EventEmitter
    eventClass = ViewEvent;
	
	// From XmlNode
	content = null;
	nodeIdentifier = null // Used to uniquely identify nodes for tree comparisons
	nodeIdentifierCounter = 0; // Used to ensure unique identifiers

	// Similar to HtmlNode .htmlDocument
	graphicalInterface = null; // If a view exists in the view hierarchy it will have a graphical interface, if this value is null then the view is detached from the view heirarchy

	// Adapts the view to an underlying component (e.g., an HtmlElement) or an iOS or Android view object
	adapter = null;

	get dimensions() {
		return this.adapter.dimensions;
	}

	get position() {
		return this.adapter.position;
	}

	constructor(content = null, parent = null) {
		// From PropagatingEventEmitter
		super();

		// Set the content
		if(content !== null) {
            this.content = content;
		}
		
		// Set the parent
		if(parent !== null) {
			this.setParent(parent);
		}
        
        // Create the adapter for the view, will be initialized when .initialize is called on the view
		this.adapter = app.interfaces.graphical.createViewAdapter(this);
		//console.log('Created adapter', this.adapter);
    }

	// See HtmlNode .setParent(parent)
	setParent(parent) {
		// Use logic from XmlNode
		XmlNode.prototype.setParent.apply(this, arguments);

		// Set a reference to the parent's graphicalInterface
		this.graphicalInterface = this.parent.graphicalInterface;
	}

	// See HtmlNode .orphan()
	orphan() {
		// Use logic from XmlNode
		XmlNode.prototype.orphan.apply(this, arguments);

		// Detach from the graphical interface
		this.detach();

		return this;
	}

	// See HtmlNode .detach()
	detach() {
		this.adapter.detach();

		this.detached();

		return this;
	}

	// See HtmlNode .unmountedFromDom()
	detached() {
		this.graphicalInterface = null; // This indicates the view is no longer part of the graphical interface's view heirarchy
	}

	// See HtmlNode .setContent()
	setContent(content) {
		this.content = content;

		this.adapter.setContent(...arguments);

		return this;
	}

	// See HtmlNode .render()
	render() {
		this.adapter.render();
	}

	// See HtmlNode .press()
	press() {
		return this.adapter.press();
	}

	// See to HtmlNode .select()
	select() {
		return this.adapter.select();
	}

	// See to HtmlNode .getSelectionText()
	getSelectionText() {
		return this.adapter.getSelectionText();
	}

	// See to HtmlNode .setSelectionRange()
	setSelectionRange() {
		return this.adapter.setSelectionRange(...arguments);
	}

	// From EventEmitter, add any event listeners to the adapter as well
	addEventListener() {
		//console.log('addEventListener', arguments, this);

		 this.adapter.addEventListener(...arguments);

		return super.addEventListener(...arguments);
	}

	// From EventEmitter, remove any event listeners from the adapter as well
	removeEventListener() {
		this.adapter.removeEventListener(...arguments);

		return super.removeEventListener(...arguments);
	}

	// From EventEmitter, remove all event listeners from the adapter as well
	removeAllEventListeners() {
		this.adapter.removeAllEventListeners(...arguments);

		return super.removeAllEventListeners(...arguments);
	}

	// Get specific settings for web views
	getWebViewAdapterSettings() {
		return {
		};
	}

	// Get specific settings for iOS views
	getIOsViewAdapterSettings() {
		return {
		};
	}

	// Get specific settings for Android views
	getAndroidViewAdapterSettings() {
		return {
		};
	}

	toString() {
		return this.content;
	}

	static makePrimitiveView(value, parent = null) {
		if(value === null || value === undefined) {
			throw new Error('PrimitiveViews may not be created from from null or undefined values.');
		}

		// If the value is currently not of type PrimitiveView, turn it into a PrimitiveView
		if(!PrimitiveView.is(value)) {
			value = new PrimitiveView(value, parent);
		}

		return value;
	}

	static is(value) {
		return Class.isInstance(value, PrimitiveView);
	}

}

// Export
export default PrimitiveView;

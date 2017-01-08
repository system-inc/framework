// Class
class ViewAdapter {

	view = null;
	adaptedView = null;

	preInitializationMethodCallQueue = [];

	constructor(view) {
		this.view = view;
	}

	initialize() {
		this.adaptedView = this.createAdaptedView();

		// Hook the adapted view's emit method
		console.log('this looks super sketchy, need to rethink this');
		this.adaptedView.emit = this.view.emit;

		preInitializationMethodCallQueue.each(function(methodCallIndex, methodCall) {
			this.adaptedView[methodCall.method](...methodCall.arguments);
		}.bind(this));

		//console.log('initialize()');

		// Synchronize the adapter with the view
		this.adapter.synchronizeWithView();

		// If there is a parent view with an adapter
		if(this.parent !== null && this.parent.adapter !== null) {
			// Add the adapter to the parent view adapter
			//console.info('adding view to parent adapter');
			this.parent.adapter.append(this.adapter.adaptedView);
		}

		// Make sure all of the children are initialized
		this.children.each(function(childViewIndex, childView) {
			childView.initialize();
		}.bind(this));

		return this;
	}

	createAdaptedView() {
		throw new Error('createAdaptedView() must be implemented by a child class of ViewAdapter.');
	}

	// All methods calls for adapted views are sent here to be queued up for when the adapted view is created
	executeMethod(method, arguments) {
		// If the adapted view exists, we can just call the method on it
		if(this.adaptedView) {
			this.adaptedView[method](...arguments);
		}
		// If the adapted view does not exist, we queue up the methods to call on it
		else {
			this.preInitializationMethodCallQueue.append({
				method: method,
				arguments: arguments,
			});
		}

		return this;
	}

	render() {
		this.view.identifier = this.adaptedView.nodeIdentifier;
		this.adaptedView.attributes = this.view.attributes;
	}

	// EventEmitter

	addEventListener() {
		return this.executeMethod('addEventListener', arguments);
	}

	removeEventListener() {
		return this.executeMethod('removeEventListener', arguments);
	}

	removeAllEventListeners() {
		return this.executeMethod('removeAllEventListeners', arguments);
	}

	// HtmlElement

	append() {
		return this.executeMethod('append', arguments);
	}

	prepend() {
		return this.executeMethod('prepend', arguments);
	}

	addClass() {
		return this.executeMethod('addClass', arguments);
	}

	setStyle() {
		return this.executeMethod('setStyle', arguments);
	}

	show() {
		return this.executeMethod('show', arguments);
	}

	hide() {
		return this.executeMethod('hide', arguments);
	}

	focus() {
		return this.executeMethod('focus', arguments);
	}

	select() {
		return this.executeMethod('select', arguments);
	}

	getSelectionText() {
		return this.executeMethod('getSelectionText', arguments);
	}

	press() {
		return this.executeMethod('press', arguments);
	}

}

// Export
export default ViewAdapter;

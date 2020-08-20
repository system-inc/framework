// Dependencies
import PrimitiveView from 'framework/system/interface/graphical/views/PrimitiveView.js';

// Class
class ViewAdapter {

	view = null;
	adaptedView = null;

	preInitializationMethodCalls = [];

	get dimensions() {
		return this.adaptedView.dimensions;
	}

	get position() {
		return this.adaptedView.position;
	}

	constructor(view) {
		this.view = view;
	}

	initialize() {
		//console.log('initialize()');

		// Create the view
		if(this.adaptedView === null) {
			this.adaptedView = this.createAdaptedView();
			//console.info('created this.adaptedView', this.adaptedView);

			// Echo events from the adaptedView to the view
			this.adaptedView.on('*', function(event) {
				this.view.emit(event.identifier, event);
			}.bind(this));
		}
		else {
			throw new Error('Adapted view already created, this should never happen?');
		}

		// Run any queued up method calls now that we have an adapted view
		this.preInitializationMethodCalls.each(function(methodCallIndex, methodCall) {
			var result = this.executeAdaptedViewMethod(methodCall.method, methodCall.storedArguments);
			methodCall.resolve(result);
		}.bind(this));
		this.preInitializationMethodCalls = [];

		return this;
	}

	createAdaptedView() {
		throw new Error('createAdaptedView() must be implemented by a child class of ViewAdapter.');
	}

	initializeAdaptedView() {
		throw new Error('createAdaptedView() must be implemented by a child class of ViewAdapter.');
	}

	// All methods calls for adapted views are sent here to be queued up for when the adapted view is created
	executeAdaptedViewMethod(method, storedArguments) {
		// If the adapted view exists, we can just call the method on it
		if(this.adaptedView) {
			//console.info('executeAdaptedViewMethod - immediately ', method, storedArguments);
			return this.adaptedView[method](...storedArguments);
		}
		// If the adapted view does not exist, we queue up the methods to call on it
		else {
			//console.info('executeAdaptedViewMethod - later', method, storedArguments);

			return new Promise(function(resolve) {
				this.preInitializationMethodCalls.append({
					method: method,
					storedArguments: storedArguments,
					resolve: resolve,
				});
			}.bind(this));
		}
	}

	detach() {
		return this.executeAdaptedViewMethod('detach', arguments);
	}

	setContent() {
		return this.executeAdaptedViewMethod('setContent', arguments);
	}

	render() {
		return this.executeAdaptedViewMethod('render', arguments);
	}

	// PropagatingEventEmitter

	addEventListener(eventPattern, functionToBind, timesToRun = null) {
		// This bound function on the adapted view will do nothing, instead the hook for the adapted view will trigger the function on the View itself
		// See the constructor for more information
		functionToBind = function(event) {
			//console.log('no op for adapted view, instead the function will be called on the View itself');
			//event.stop();
		};

		return this.executeAdaptedViewMethod('addEventListener', [
			eventPattern,
			functionToBind,
			timesToRun,
		]);
	}

	removeEventListener() {
		return this.executeAdaptedViewMethod('removeEventListener', arguments);
	}

	removeAllEventListeners() {
		return this.executeAdaptedViewMethod('removeAllEventListeners', arguments);
	}

	// HtmlElement

	addChild(childView, arrayMethod = 'append') {
		return this.executeAdaptedViewMethod('addChild', [childView.adapter.adaptedView, arrayMethod]);
	}

	removeChild(childView) {
		return this.executeAdaptedViewMethod('removeChild', [childView.adapter.adaptedView]);
	}

	setAttribute() {
		return this.executeAdaptedViewMethod('setAttribute', arguments);
	}

	removeAttribute() {
		return this.executeAdaptedViewMethod('removeAttribute', arguments);
	}

	show() {
		return this.executeAdaptedViewMethod('show', arguments);
	}

	hide() {
		return this.executeAdaptedViewMethod('hide', arguments);
	}

	focus() {
		return this.executeAdaptedViewMethod('focus', arguments);
	}

	setHeight() {
		return this.executeAdaptedViewMethod('setHeight', arguments);
	}

	setWidth() {
		return this.executeAdaptedViewMethod('setWidth', arguments);
	}

	select() {
		return this.executeAdaptedViewMethod('select', arguments);
	}

	getSelectionText() {
		return this.executeAdaptedViewMethod('getSelectionText', arguments);
	}

	setSelectionRange() {
		return this.executeAdaptedViewMethod('setSelectionRange', arguments);
	}

	press() {
		return this.executeAdaptedViewMethod('press', arguments);
	}

}

// Export
export default ViewAdapter;

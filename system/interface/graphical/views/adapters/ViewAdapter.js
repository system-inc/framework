// Class
class ViewAdapter {

	view = null;
	adaptedView = null;

	preInitializationMethodCalls = [];

	constructor(view) {
		this.view = view;
	}

	initialize() {
		//console.log('initialize()');

		// Create the view
		if(this.adaptedView === null) {
			this.adaptedView = this.createAdaptedView();	
			//console.info('created this.adaptedView', this.adaptedView);

			// Hook the adapted view's emit function
			var standardAdaptedViewEmit = this.adaptedView.emit;
			this.adaptedView.emit = async function(eventIdentifier, data, eventOptions) {
				//console.warn('emit', arguments);

				// We also emit the event on the view
				await this.view.emit.apply(this.view, arguments);

				// Emit the event on the adapted view as normal
				return await standardAdaptedViewEmit.apply(this.adaptedView, arguments);
			}.bind(this);
		}
		else {
			throw new Error('Adapted view already created, this should never happen?');
		}

		// Hook the adapted view's emit method
		//console.log('this looks super sketchy, need to rethink this');
		//this.adaptedView.emit = this.view.emit;

		// Run any queued up method calls now that we have an adapted view
		this.preInitializationMethodCalls.each(function(methodCallIndex, methodCall) {
			this.executeAdaptedViewMethod(methodCall.method, methodCall.storedArguments);
		}.bind(this));
		this.preInitializationMethodCalls = [];

		return this;
	}

	createAdaptedView() {
		throw new Error('createAdaptedView() must be implemented by a child class of ViewAdapter.');
	}

	// All methods calls for adapted views are sent here to be queued up for when the adapted view is created
	executeAdaptedViewMethod(method, storedArguments) {
		// If the adapted view exists, we can just call the method on it
		if(this.adaptedView) {
			// Handle adding children
			if(method === 'addChild') {
				method = storedArguments[1];
				var childView = storedArguments[0];
				if(childView.adapter.adaptedView === null) {
					childView.initialize();
				}
				storedArguments = [childView.adapter.adaptedView];
			}

			//console.info('executeAdaptedViewMethod - immediately ', method, storedArguments);
			this.adaptedView[method](...storedArguments);
		}
		// If the adapted view does not exist, we queue up the methods to call on it
		else {
			//console.info('executeAdaptedViewMethod - later', method, storedArguments);

			this.preInitializationMethodCalls.append({
				method: method,
				storedArguments: storedArguments,
			});
		}

		return this;
	}

	render() {
		return this.executeAdaptedViewMethod('render', arguments);
	}

	// PropagatingEventEmitter

	addEventListener(eventPattern, functionToBind, timesToRun = null) {
		// The bound function on the adapted view will do nothing, instead the hook for the adapted view will trigger the function on the View itself
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

	empty() {
		return this.executeAdaptedViewMethod('empty', arguments);	
	}

	prepend(childView) {
		return this.addChild(childView, 'prepend');
	}

	append(childView) {
		return this.addChild(childView, 'append');
	}

	setAttribute() {
		return this.executeAdaptedViewMethod('setAttribute', arguments);
	}

	addChild(childView, arrayMethod = 'append') {
		return this.executeAdaptedViewMethod('addChild', arguments);
	}

	setContent() {
		return this.executeAdaptedViewMethod('setContent', arguments);	
	}

	addClass() {
		return this.executeAdaptedViewMethod('addClass', arguments);
	}

	removeClass() {
		return this.executeAdaptedViewMethod('removeClass', arguments);
	}

	setStyle() {
		return this.executeAdaptedViewMethod('setStyle', arguments);
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

	select() {
		return this.executeAdaptedViewMethod('select', arguments);
	}

	getSelectionText() {
		return this.executeAdaptedViewMethod('getSelectionText', arguments);
	}

	press() {
		return this.executeAdaptedViewMethod('press', arguments);
	}

}

// Export
export default ViewAdapter;

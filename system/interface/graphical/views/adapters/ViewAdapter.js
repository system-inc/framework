// Dependencies
import { View } from '@framework/system/interface/graphical/views/View.js';

// Class
class ViewAdapter {

	initialized = false;
	view = null;
	adaptedView = null;

	get dimensions() {
		return this.adaptedView.dimensions;
	}

	get position() {
		return this.adaptedView.position;
	}

	constructor(view) {
		this.view = view;
	}

	initialize(existingAdaptedView = null) {
		//console.log('initialize()');

		// We will not initialize until the view exists on the view heirarchy
		if(!this.initialized && this.view.graphicalInterface !== null) {
			// Create the adapted view
			if(this.adaptedView === null) {
				// Use an existing adapted view if it is provided
				if(existingAdaptedView !== null) {
					this.adaptedView = existingAdaptedView;
				}
				else {
					this.adaptedView = this.createAdaptedView();
				}

				// Initialize the adapted view
				this.initializeAdaptedView(this.adaptedView);
				
				//console.info('created this.adaptedView', this.adaptedView);

				// Initialize and create the adapted views for all of the view's children
				if(View.is(this.view)) {
					this.view.children.each(function(childViewIndex, childView) {
						childView.adapter.initialize();

						// Add add the child's adapted view to this adapted view
						this.adaptedView.addChild(childView.adapter.adaptedView);
					}.bind(this));
				}

				this.initialized = true;
			}
			else {
				throw new Error('Adapted view already created, this should never happen');
			}
		}

		return this;
	}

	createAdaptedView() {
		throw new Error('createAdaptedView() must be implemented by a child class of ViewAdapter.');
	}

	initializeAdaptedView() {
		// Attach the event listeners from the view onto the adapted view
		this.view.eventListeners.each(function(eventListenerIndex, eventListener) {
			//console.log('adding event listener for', eventListener.eventPattern);

			// The adapted view will listen for events and then emit them on the view
			this.adaptedView.addEventListener(eventListener.eventPattern, this.emitEventFromView.bind(this), eventListener.timesToRun);
		}.bind(this));
		//console.log('event listeners on this.view.eventListeners', this.view.eventListeners, 'event listeners on this.adaptedView.eventListeners', this.adaptedView.eventListeners);
	}

	// All methods calls for adapted views are sent here
	executeAdaptedViewMethod(method, storedArguments) {
		// Adapted views are expensive to create
		// We do not create or manipulate any adapted views until the view exists in the view heirarchy
		if(this.view.graphicalInterface !== null) {
			// If the adapted view does not exist yet, create it and all of its children
			this.initialize();

			//console.info('executeAdaptedViewMethod - immediately ', method, storedArguments);
			//console.log('Running', method, 'on adapted view for', this.view, 'it exists in the view heirarchy', storedArguments);

			// Run the method on the adapted view
			return this.adaptedView[method](...storedArguments);
		}
		else {
			//console.log('Skipping', method, 'on adapted view for', this.view, 'until it exists in the view heirarchy');
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

	// See PropagatingEventEmitter

	addEventListener(eventPattern, functionToBind, timesToRun = null) {
		// This bound function on the adapted view will not actually run
		// Instead, it will cause the view to emit the event
		functionToBind = this.emitEventFromView.bind(this);

		return this.executeAdaptedViewMethod('addEventListener', [
			eventPattern,
			functionToBind,
			timesToRun,
		]);
	}

	emitEventFromView(event) {
		this.view.emit(event.identifier, event);
	}

	addEventListenerToAdaptedView(eventPattern, functionToBind, timesToRun = null) {

	}

	removeEventListener() {
		return this.executeAdaptedViewMethod('removeEventListener', arguments);
	}

	removeAllEventListeners() {
		return this.executeAdaptedViewMethod('removeAllEventListeners', arguments);
	}

	// See HtmlElement

	addChild(adaptedView, arrayMethod = 'append') {
		return this.executeAdaptedViewMethod('addChild', arguments);
	}

	removeChild(adaptedView) {
		return this.executeAdaptedViewMethod('removeChild', arguments);
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
export { ViewAdapter };
